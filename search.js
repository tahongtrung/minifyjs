var SEARCH_TIME_OUT = 20;
var $ = jQuery;

function trimSpace(string) {
    return string.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
}

function trimSpecialCharacter(string) {
    return string.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, ' ');
}

function highlight(match, keyword) {
    keyword = trimSpace(keyword);
    keyword = keyword.split(' ').join('|');
    var matcher = new RegExp('(' + keyword + ')', 'gi');
    return match.replace(matcher, "<span class='highlight'>$1</span>");
}

function resultSanPham(data, keyword) {
    var result = '';
    $.each(data, function (key, value) {
        result += '<li class="san_pham list-group-item">';
        result += '<h5><a data-id="' + value.id + '" data-ten="' + value.ten + '" data-msp="' + value.ma_san_pham + '">' + value.ten + ' - ' + value.ma_san_pham + '</a></h5>';
        result += '</li>';
    });
    return result;
}
function getDataFromES(keyword, $result) {
    $.ajax({
        url: window.location.origin + '/suggest-order',
        dataType: "json",
        data: {
            term: trimSpecialCharacter(keyword),
        },
        success: function (data) {
            if (data.length > 0) {
                $('#result').show();

                $result.html(resultSanPham(data, keyword));
            } else {
                $result.empty();
            }
        }
    });
}

$(document).ready(function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    var $result = $('.thuoc');
    var $input_search = $('#s');
    var $input_loai = $('input[name="loai"]');

    $(document).on('click', function (e) {
        if ($(e.target).attr('id') != "result") {
            $('#result').hide();
        }

        if ($(e.target).attr('id') === "s") {
            $('#result').show();
        }
    });
   
    $('body').on('click','li.san_pham',function(e){
        e.preventDefault()
      
        var ten = $(this).find('a').data("ten");
        var id = $(this).find('a').data("id");
        var msp = $(this).find('a').data("msp");


        $.post(window.location.origin + '/auth/product/price',{msp:msp},function(dt){
            //console.log(dt);
            var ma_dvt = dt.dvt_default;
            var gia_default = dt.gia_ban_default;
            //var price  = parseInt(dt.price);
            var lv1    = dt.dvt_lv1;
            var lv2    = dt.dvt_lv2;
            var lv3    = dt.dvt_lv3;

            var mlv1   = dt.ma_dvt_lv1;
            var mlv2   = dt.ma_dvt_lv2;
            var mlv3   = dt.ma_dvt_lv3;

            var dongia = parseInt((dt.price_dvt_lv1)? dt.price_dvt_lv1:( (dt.price_dvt_lv2)? dt.price_dvt_lv2: (dt.price_dvt_lv3)? dt.price_dvt_lv3:0 ));
            //console.log(dongia);
            var gia_default = parseInt(dt.gia_ban_default);
            //console.log(gia_default);
            $.post(window.location.origin + '/auth/product/ton',{id:msp},function(data){
                /*sản phẩm đã có trong bảng*/
                if($( "#tb-search" ).has( "tr#"+id+"-tb" ).length) {

                    var qty = parseInt($("tr#"+id+"-tb td input.qtys").val())+1;
                    
                    var ton = parseInt($("tr#"+id+"-tb td input.ton_val").val());
                   
                    var gia = parseInt(($("tr#"+id+"-tb td input.gia_one").val()));
                    
                    if(qty<=ton){
                        
                        $("tr#"+id+"-tb td input.qtys").attr('value', qty);
                        $("tr#"+id+"-tb td input.gia_val").val(gia*qty);

                        $('#summary_tb tbody tr#'+id+" td.sum_tien").text( vMonney(qty * gia) );
                        $('#summary_tb tbody tr#'+id+" td.sum_sl").text(qty);

                        var sum = 0;
						if ($(".sum_tien").length>0){
							$('.sum_tien').each(function() {
								sum+=Number($(this).text().replace(/\./g,""))
							});
						}
                        $('#sum_money').val(vMonney(sum));
						if ($("#iship").length>0){
							var ship = Number($('#iship').val().replace(/\./g,""));
						}
						if ($("#last_money").length>0){
							$('#last_money').val(vMonney(sum+ship));
						}
                    }else{
                        console.log('reached limit');
                        //alert('Vượt quá số lượng tồn!');
                    }
                   
                    return false;
                }else{
                    /*sản phẩm chưa có thêm mới row vào bảng*/
                    var dvb  = '<select name="don_vi_ban" class="form-control don_vi_ban">';
                        dvb += (lv1)? '<option value="'+mlv1+'"'+((dt.name_dvt_default===lv1)?"selected":"")+'>'+lv1+'</option>':'';
                        dvb += (lv2)? '<option value="'+mlv2+'"'+((dt.name_dvt_default===lv2)?"selected":"")+'>'+lv2+'</option>':'';
                        dvb += (lv3)? '<option value="'+mlv3+'"'+((dt.name_dvt_default===lv3)?"selected":"")+'>'+lv3+'</option>':'';
                        dvb += '</select>';
                    //console.log(dvb);
                    var sl  = (data.ton == 0) ? 0 : 1;
                    var url = window.location.origin + "/auth/order/product/";

                    var exchange = function () {
                        var temp = "";
                        $.ajax({
                            //'async': false,
                            'type': "POST",
                            'global': false,
                            'dataType': 'JSON',
                            'url': window.location.origin + "/auth/order/exchange",
                            'data': { msp:msp },
                            'success': function (raw) {
                                temp += (raw.DVT_Lv1)?raw.DVT_Lv1:"";
                                temp += (raw.DVT_Lv2)?(" - "+raw.DVT_Lv2):"";
                            }
                        });
                        return temp;
                    }();

                    $('#tb-search tbody').append('\
                        <tr id="'+id+'-tb">\
                            <td>\
                                <span><a target="_blank" href="'+url+id+'">'+ten+' - '+msp+'</a></span>\
                                <input type="hidden" name="product_names[]" value="'+ten+'" >\
                                <input type="hidden" name="product_ids[]" value="'+id+'" >\
                                <input type="hidden" name="msps[]" value="'+msp+'" >\
                                <input type="hidden" name="madvts[]" value="'+ma_dvt+'">\
                                <br><span class="exchange">'+exchange+'</span>\
                            </td>\
                            <td>\
                                <input type="number" data-id="'+id+'" step="1" min="1" class="qtys form-control" name="qtys[]" value="'+sl+'" style="width:100%">\
                            </td>\
                            <td>\
                                <span class="gia_don_vi">'+dt.name_dvt_default+'</span>\
                            </td>\
                            <td>\
                                <span class="ton">'+data.ton+'</span>\
                                <input type="hidden" name="tonkho[]" class="ton_val" value="'+data.ton+'" style="width:100%">\
                            </td>\
                            <td>\
                                '+dvb+'\
                            </td>\
                            <td>\
                                <span class="gia">'+vMonney(gia_default)+'</span>\
                                <input type="hidden" class="gia_val" name="gia[]" min="1" value="'+gia_default+'" style="width:100%">\
                                <input type="hidden" class="gia_one" name="gia_one[]" value="'+gia_default+'">\
                            </td>\
                            <td><a href="#" class="btn btn-danger btn-xs btn-remove" data-id="'+id+'"><i class="fa fa-close"></i></a></td>\
                        </tr>'
                    );
                    $('#s').val('');
                    if(sl==1){
                        $('#summary_tb tbody').append('\
                            <tr id="'+id+'">\
                                <td>'+ten+'</td>\
                                <td class="sum_sl">'+sl+'</td>\
                                <td>'+dt.name_dvt_default+'</td>\
                                <td>'+data.ton+'</td>\
                                <td>'+vMonney(gia_default)+'</td>\
                                <td class="sum_tien">'+vMonney(1*gia_default)+'</td>\
                            </tr>\
                        ');
                    }
                    /*sum money*/
                    var sum = 0;
					if ($(".sum_tien").length>0){
						$('.sum_tien').each(function() {
							sum+=Number($(this).text().replace(/\./g,""))
						});
					}
					if ($("#sum_money").length>0){
						$('#sum_money').val(vMonney(sum));
					}
					if ($("#iship").length>0){
						var ship = Number($('#iship').val().replace(/\./g,""));
					}
					if ($("#last_money").length>0){
						$('#last_money').val(vMonney(sum+ship));
					}
                }
                
            });
            
        });
   
    });
    
    var timeOut = null;

    $input_search.keypress(function (event) {
        var code = event.keyCode || event.which;

        if (code === 13) {
            if (0 === $(this).val().length) {
                alert('Bạn chưa nhập từ khóa tìm kiếm');
                $(this).focus();
                return false;
            }
        }
    });

    $input_search.keyup(function () {
        clearTimeout(timeOut);

        if (0 === $(this).val().length) {
            $result.empty();
        }

        timeOut = setTimeout(function () {
            $input_search.autocomplete({
                minLength: 1,
                source: function (request) {
                    getDataFromES(request.term, $result);
                }
            });
        }, SEARCH_TIME_OUT);
    });
});
/*partial blade*/
$(function () {
    $('#ngay_giao_hang').datetimepicker({
        format: 'DD/MM/YYYY HH:mm:ss'
    });
});
$('body').on('change','.don_vi_ban',function(e){
    e.preventDefault();

    var mdvt   = $(this).val();
    var anchor = $(this);
    var idsp   = $(this).closest('tr').find('td input[name="product_ids[]"]').val();

    $.post(window.location.origin + "/auth/order/dongia", {madvt:mdvt,id:idsp},function(data,status){
        var dvt = parseInt(data.dvt);
        anchor.closest('tr').find('.gia').text(vMonney(dvt));
    });
});

$('#cuahang_code').selectize({
    onChange: function(value) {
        var product_names = [];
        var msps          = []; 
        var qtys          = [];
        var madvts        = [];
        var gia_ones      = [];
        
        var formData      = new FormData();

        $('input[name="product_names[]"]').each(function() {
            product_names.push($(this).val());
        });

        if(product_names.length == 0){
            $('#ctkm').html('');
            $('#ctkm').append('<li class="list-group-item text-center">\
                                    <span>Chưa chọn sản phẩm</span>\
                                </li>');
            return false;
        }

        $('input[name="qtys[]"]').each(function() {
            qtys.push(parseInt($(this).val()));
        });
        $('input[name="msps[]"]').each(function() {
            msps.push($(this).val());
        });
        $('input[name="madvts[]"]').each(function() {
            madvts.push(parseInt($(this).val()));
        });
        $('input[name="gia_one[]"]').each(function() {
            gia_ones.push(parseInt($(this).val()));
        });
        
        formData.append("product_names", product_names);
        formData.append("msps", msps);
        formData.append("qtys", qtys);
        formData.append("madvts", madvts);
        formData.append("prices", gia_ones);
        formData.append("shop", value);
      
        $.ajax({
            url: window.location.origin + '/auth/order/promotion',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            /*timeout: 5000,*/
            beforeSend: function() {
                $('#ctkm').html('');
                $('#ctkm').append('<li class="list-group-item text-center">\
                                    <span><i class="fa fa-refresh fa-spin" style="font-size:24px"></i></span>\
                                    </li>');
            },
            success: function ( data ) {
                console.log(data);
                if(data==0){
                    $('#ctkm').html('');
                    $('#ctkm').append('<li class="list-group-item">\
                        <span> Không có chương trình khuyến mãi </span>\
                        </li>');
                }
                else{
                    $('#ctkm').html('');
                    for (var index = 0; index < data.length; ++index) {

                        if(parseInt(data[index].tiengiam) !== 0){

                            var t = msps.indexOf(data[index].MaSP);

                            $('#ctkm').append('<li class="list-group-item">\
                                        <input type="checkbox" class="icb" value="'+data[index].Cocau+'">\
                                        <span id="km_input">\
                                            <input type="hidden" disabled name="MaSP[]" value="'+data[index].MaSP+'">\
                                            <input type="hidden" disabled name="LineNum[]" value="'+data[index].LineNum+'">\
                                            <input type="hidden" disabled name="tiengiam[]" value="'+data[index].tiengiam+'">\
                                            <input type="hidden" disabled name="Cocau[]" value="'+data[index].Cocau+'">\
                                            <input type="hidden" disabled name="MaSP_Tangchinh[]" value="'+data[index].MaSP_Tangchinh+'">\
                                            <input type="hidden" disabled name="TenSP_Tangchinh[]" value="'+data[index].TenSP_Tangchinh+'">\
                                            <input type="hidden" disabled name="SL_TangChinh[]" value="'+data[index].SL_TangChinh+'">\
                                            <input type="hidden" disabled name="DVT_TangChinh[]" value="'+data[index].DVT_TangChinh+'">\
                                            <input type="hidden" disabled name="TenDVT_TangChinh[]" value="'+data[index].TenDVT_TangChinh+'">\
                                            <input type="hidden" disabled name="MaSP_Tangthaythe[]" value="'+data[index].MaSP_Tangthaythe+'">\
                                            <input type="hidden" disabled name="TenSP_Tangthaythe[]" value="'+data[index].TenSP_Tangthaythe+'">\
                                            <input type="hidden" disabled name="SL_Tangthaythe[]" value="'+data[index].SL_Tangthaythe+'">\
                                            <input type="hidden" disabled name="DVT_Tangthaythe[]" value="'+data[index].DVT_Tangthaythe+'">\
                                            <input type="hidden" disabled name="TenDVT_TangThayThe[]" value="'+data[index].TenDVT_TangThayThe+'">\
                                            <input type="hidden" disabled name="SL_Mua[]" value="'+data[index].SL_Mua+'">\
                                            <input type="hidden" disabled name="DVT_Mua[]" value="'+data[index].DVT_Mua+'">\
                                            <input type="hidden" disabled name="Ten_DVT[]" value="'+data[index].Ten_DVT+'">\
                                        </span>\
                                        <span> '+product_names[t]+' - Tiền giảm: '+ vMonney(parseInt(data[index].tiengiam))+'</span>\
                                    </li>');
                        }else{
                            var gift = (data[index].TenSP_Tangchinh) ? "Tặng chính: "+data[index].TenSP_Tangchinh: ((data[index].TenSP_Tangthaythe)? "Tặng thay thế: "+ data[index].TenSP_Tangthaythe:"");
                            $('#ctkm').append('<li class="list-group-item">\
                                        <input type="checkbox" class="icb" value="'+data[index].Cocau+'">\
                                        <span id="km_input">\
                                            <input type="hidden" disabled name="MaSP[]" value="'+data[index].MaSP+'">\
                                            <input type="hidden" disabled name="LineNum[]" value="'+data[index].LineNum+'">\
                                            <input type="hidden" disabled name="tiengiam[]" value="'+data[index].tiengiam+'">\
                                            <input type="hidden" disabled name="Cocau[]" value="'+data[index].Cocau+'">\
                                            <input type="hidden" disabled name="MaSP_Tangchinh[]" value="'+data[index].MaSP_Tangchinh+'">\
                                            <input type="hidden" disabled name="TenSP_Tangchinh[]" value="'+data[index].TenSP_Tangchinh+'">\
                                            <input type="hidden" disabled name="SL_TangChinh[]" value="'+data[index].SL_TangChinh+'">\
                                            <input type="hidden" disabled name="DVT_TangChinh[]" value="'+data[index].DVT_TangChinh+'">\
                                            <input type="hidden" disabled name="TenDVT_TangChinh[]" value="'+data[index].TenDVT_TangChinh+'">\
                                            <input type="hidden" disabled name="MaSP_Tangthaythe[]" value="'+data[index].MaSP_Tangthaythe+'">\
                                            <input type="hidden" disabled name="TenSP_Tangthaythe[]" value="'+data[index].TenSP_Tangthaythe+'">\
                                            <input type="hidden" disabled name="SL_Tangthaythe[]" value="'+data[index].SL_Tangthaythe+'">\
                                            <input type="hidden" disabled name="DVT_Tangthaythe[]" value="'+data[index].DVT_Tangthaythe+'">\
                                            <input type="hidden" disabled name="TenDVT_TangThayThe[]" value="'+data[index].TenDVT_TangThayThe+'">\
                                            <input type="hidden" disabled name="SL_Mua[]" value="'+data[index].SL_Mua+'">\
                                            <input type="hidden" disabled name="DVT_Mua[]" value="'+data[index].DVT_Mua+'">\
                                            <input type="hidden" disabled name="Ten_DVT[]" value="'+data[index].Ten_DVT+'">\
                                        </span>\
                                        <span>'+ gift +'</span>\
                                    </li>');
                        }
                    }
                }

            },
            error:function(data,status){
                $('#ctkm').html('');
                $('#ctkm').append('<li class="list-group-item">\
                    Load khuyến mãi thất bại: <span class="label label-danger">'+status+'</span>\
                    </li>');
            }
        });
    }
});