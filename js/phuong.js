
var postUrl =
    "https://script.google.com/macros/s/AKfycbzuQ4HlRTcd6Ilnj25ZTcppEnWnS9gyVm_ho1wZUXpCj_ngwSRNxcKyZ8tAJALIQLbB/exec";
$(document).ready(function () {
    var submit = $("#submit-form");
    submit.click(function () {
        let ten = $("#ten").val();
        let dienThoai = $("#dienThoai").val();
        let tongCong = $("#lblTongCong").text();
        log(ten, dienThoai, tongCong);
        alert(`
            Xin cảm ơn đã ủng hộ! 
            Đơn hàng của Quý Khách ${ten} là ${tongCong} đồng. 
            Chúng tôi sẽ gọi số ${dienThoai} của Quý Khách để xác nhận đơn hàng!
          `);
        var data = $("form#test-form").serialize();
        $.ajax({
            type: "GET",
            url: postUrl,
            dataType: "json",
            crossDomain: true,
            data: data,
            success: function (data) {
                if (data == "false") {
                    log("Có lỗi, xin hãy nhập lại! Hoặc gọi cho hotline.");
                } else {
                    log(`
                    Xin cảm ơn Quý Khách ${ten}!
                    Tổng đơn hàng là ${tongCong} đồng. 
                    Chúng tôi sẽ gọi số ${dienThoai} để xác nhận đơn hàng!
                  `);
                }
            },
        });
        return false;
    });
});

const log = console.log;
var arrData = [];
var soMatHang;
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(this.responseText).feed.entry;
        //console.log(data);
        soMatHang = data.length;
        let i;
        for (i = 0; i < data.length; i++) {
            let stt = data[i]["gsx$stt"]["$t"];
            let mathang = data[i]["gsx$mathang"]["$t"];
            let gia = data[i]["gsx$gia"]["$t"];
            gia = Number(gia);
            let soluong = 0;
            let tong = gia * soluong;
            let ghichu = data[i]["gsx$ghichu"]["$t"];

            var obj;
            obj = {
                stt: stt,
                mathang: mathang,
                gia: gia,
                soluong: soluong,
                tong: tong,
                ghichu: ghichu,
            };
            arrData.push(obj);

            document.getElementById("tableBody").innerHTML += `
                  <tr>
                      <th scope="row">${stt}</th>
                      <td>${mathang}</td>
                      <td id="gia${i + 1}">${gia}</td>
                      <td>
                          <input type="number" list="defaultNumbers" style="padding: 1px; width: 4em;"
                          min="0" max="20" step="0.5" name="${stt}">
                          <datalist id="defaultNumbers">
                          <option value="1">
                          <option value="2">
                          <option value="3">
                      </datalist>
                      </td>
                      <td id="tong${i + 1}">${tong}</td>
                      <td>${ghichu}</td>
                  </tr>
                  `;
        }
    }
};
const getUrl =
    "https://spreadsheets.google.com/feeds/list/1WYNSjXC755-_PumH4BU4d8lCFGjocs6m8E-EOdS40aQ/od6/public/values?alt=json";
xmlhttp.open(
    "GET",
    getUrl,
    //"https://spreadsheets.google.com/feeds/list/1WYNSjXC755-_PumH4BU4d8lCFGjocs6m8E-EOdS40aQ/od6/public/values?alt=json",
    true
);
xmlhttp.send();
$("#myTable").change(capNhatGia);
function capNhatGia() {
    log("clicked label")
    let tongCong = 0;
    for (i = 1; i <= soMatHang; i++) {
        let currentRow = $("#myTable tr").eq(i)

        let gia = currentRow.children().eq(2).text();
        let soluong = currentRow.find("input").val();
        let tong = gia * soluong;
        tongCong += tong;
        // log(gia)
        // log(soluong)
        // log(tong)
        currentRow.children().eq(4).text(tong);
    }
    $("#lblTongCong").text(tongCong + " k");
}
