/**************
   order.js
**************/
var MAX_INT = 9007199254740992;
var MIN_INT = -9007199254740992;

var require = function initHTNH(){
    
    var check = $('#hinh_thuc_nhan_hang').val();
    if(check === '1'){ 

        $('#ho_ten').prop("required", true);
        $('#thanh_pho').prop("required", true);
        $('#quan').prop("required", true);
        // $('#phuong').prop("required", true);
        $('#dia_chi').prop("required", true);

        if($("label[for='ho_ten'] small span.require").length == 0) $("label[for='ho_ten'] small").append('<span class="require">*</span>');
        if($("label[for='thanh_pho'] small span.require").length == 0) $("label[for='thanh_pho'] small").append('<span class="require">*</span>');
        if($("label[for='quan'] small span.require").length == 0) $("label[for='quan'] small").append('<span class="require">*</span>');
        // if($("label[for='phuong'] small span.require").length == 0) $("label[for='phuong'] small").append('<span class="require">*</span>');
        if($("label[for='dia_chi'] small span.require").length == 0) $("label[for='dia_chi'] small").append('<span class="require">*</span>');
     
    }else{
        
        $('#ho_ten').prop("required", false);
        $('#thanh_pho').prop("required", false);
        $('#quan').prop("required", false);
        // $('#phuong').prop("required", false);
        $('#dia_chi').prop("required", false);

        $("label[for='ho_ten'] small span.require").remove();
        $("label[for='thanh_pho'] small span.require").remove();
        $("label[for='quan'] small span.require").remove();
        // $("label[for='phuong'] small span.require").remove();
        $("label[for='dia_chi'] small span.require").remove();
    }
}();
function vMonney(x){
  return x.toLocaleString('vi-VN');
}
function clearCustomer(){
    $('#tuoi').val('');
    $('#id').val('');
    $('#dien_thoai_1').val('');
    $('#ho_ten').val('');
    $('#dien_thoai_2').val('');
    $('#dia_chi').val('');
    $('#email').val('');
    $('#phuong').val('');
    $('#quan').val('');
    $('#thanh_pho').val('');
    $('#short_description').val('');
    $('#description').val('');
    $("#gioi_tinh option:selected").prop("selected", false);
    var $select = $('#thanh_pho').selectize();
    var control = $select[0].selectize;
    control.clear();
    $('#quan').prop('disabled', true);
    $('#phuong').prop('disabled', true);
}
function sumAddress(){
    var diachi = $("#dia_chi").val();
    var tp = $("#thanh_pho option:selected").text() ;
    var thanhpho = ($("#thanh_pho option:selected").val() != "")? (', '+tp) : '';
    var q = $("#quan option:selected").text() ;
    var quan = ($("#quan option:selected" ).val() != "")? (', '+q) : '';
    var p = $("#phuong option:selected" ).text();
    var phuong = ($("#phuong option:selected").val() != "")? (', '+p) : '';
   
    $("#summary_diachi").text(diachi+phuong+quan+thanhpho);
}
$(function() {

    $('body').addClass('sidebar-collapse');
    
    $("#ho_ten").on({
        "change keyup": function(e){
            var slug = $(this).val();
            $("#summary_ten").text(slug);
        },
    });
    $("#dien_thoai_1").on({
        "change keyup": function(e){
            var slug = $(this).val();
            $("#summary_phone1").text(slug);
        },
    });
    $("#dien_thoai_2").on({
        "change keyup": function(e){
            var slug = $(this).val();
            $("#summary_phone2").text(slug);
        },
    });
    $("#dia_chi").on({
        "change keyup": function(e){
            sumAddress();
            /*var slug = $(this).val();
           
            var tp = $("#thanh_pho option:selected" ).text() ;
            var thanhpho = (tp != "chọn tỉnh/thành phố")? ', '+tp : '';
            var q = $("#quan option:selected" ).text() ;
            var quan = (q != "chọn quận/huyện")? ', '+q : '';
            var p = $("#phuong option:selected" ).text();
            var phuong = (p != "chọn phường/xã")? ', '+p : '';
            console.log(quan + phuong);
            $("#summary_diachi").text(slug+phuong+quan+thanhpho);*/
        },
    });
   
   $('#dien_thoai_1').on('keyup blur focus',function(e){
        if(e.type=="keyup"){

            //$(this).closest('div').find('span.help-block').css('display','none');
            
            $('#phone_list').html('');
            $.post(window.location.origin + '/auth/customer/phone',{phone:$(this).val()},function(data){
                $('#phone_list').html('');
                var result = '';
                $.each(data, function (key, value){
                    result += '<li class="list-group-item phone">';
                    result += '<a href="" data-id="'+value.id+'">'+value.dien_thoai_1+' - '+value.ho_ten+'</a>';
                    result +='</li>';
                });
                $('#phone_list').html(result);
            });

        }
        if(e.type=="blur") setTimeout(function(){
            $('#phone_s').css('display','none');
        },200);
        if(e.type="focus")setTimeout(function(){
            $('#phone_s').css('display','block');
        },0);   
        
    });
   
    $('body').on('click','li.phone a',function(e){
        e.preventDefault();
        setTimeout(function(){
            $('#phone_s').css('display','none');
        },300);   
        $.post(window.location.origin + '/auth/customer/id',{id:$(this).data('id')},function(data){
            
            $('#id').val(data.id);
            $('#dien_thoai_1').val(data.dien_thoai_1);
            $('#dien_thoai_2').val(data.dien_thoai_2);
            $('#ho_ten').val(data.ho_ten);
            $('#dia_chi').val(data.dia_chi);
            $('#email').val(data.email);
            $('#tuoi').val(data.tuoi);
            
            $('#summary_ten').text(data.ho_ten);
            $('#summary_phone1').text(data.dien_thoai_1);
            $('#summary_phone2').text(data.dien_thoai_2);
            $('#summary_diachi').text(data.dia_chi);

            $('#thanh_pho')[0].selectize.setValue(data.thanh_pho);
           
            setTimeout(function(){
                $("select#quan option[value="+data.quan+"]").prop("selected", true);
                $('#phuong').prop('disabled', false);
            },200);
           
            var phuong = data.phuong;
            //console.log('phuong');
            //console.log(data);
            
            $.post(window.location.origin + '/auth/phuong',{title:data.quan},function(data){
                
                //console.log(data);
                var dphuong = '<option value="">chọn phường/xã</option>';
                $.each(data, function(index, element) {
                    if(element.id == phuong){
                        dphuong += '<option selected value="'+element.id+'">'+element.full_title+'</option>';
                    }else{
                        dphuong +='<option value="'+element.id+'">'+element.full_title+'</option>'
                    }
                    
                });
                $('#phuong').html('');
                $('#phuong').html(dphuong);
                //console.log(dphuong);
            });
            
        });
    })

    /* hit remove button in bill detail*/
    $("body").on("click", ".btn-remove", function(e){
        e.preventDefault();
        var id = $(this).data('id');
        $("#"+id).remove();
        $(this).closest('tr').remove ();
        var sum = 0;
        $('.sum_tien').each(function() {
            sum+=Number($(this).text().replace(/\./g,""))
        });
        $('#sum_money').val(vMonney(sum));
        var ship = Number($('#iship').val().replace(/\./g,""));
        $('#last_money').val(vMonney(sum+ship));
    });

    $(document).ready(function(){
        var sum = 0;
        $('.sum_tien').each(function() {
            sum+=Number($(this).text().replace(/\./g,""))
        });
        $('#sum_money').val(vMonney(sum));
        var ship = Number($('#iship').val().replace(/\./g,""));
        $('#last_money').val(vMonney(sum+ship));
    });

    $('body').on('change','.qtys',function(e){
        e.preventDefault();

        var ton = $(this).closest('tr').find('.ton').text();
        
        if($(this).val()>parseInt(ton)){
            $(this).val(parseInt(ton));
        }
       
        var qty = $(this).val();
   
        $(this).attr('value', parseInt(qty));

        var gia = parseInt($(this).closest('tr').find('.gia_one').val());
       
        var id = $(this).data('id');

        $('tr#'+id+" td.sum_tien").text( vMonney(qty * gia) );
        $('tr#'+id+" td.sum_sl").text(qty);
        
        var sum = 0;
        $('.sum_tien').each(function() {
            sum+=Number($(this).text().replace(/\./g,""))
        });
        $('#sum_money').val(vMonney(sum));
        var ship = Number($('#iship').val().replace(/\./g,""));
        $('#last_money').val(vMonney(sum+ship));
        
    });

    $('#iship').on('keyup',function(e){
        e.preventDefault();
       
        var ship = Number(($(this).val().replace(/\./g,"")));
        
        if(ship > MAX_INT || ship < MIN_INT){
            return false;
        }else{

            $('#ship').val(ship);
            $('#iship').val(vMonney(ship));
            
            var sum=parseInt($('#sum_money').val().replace(/\./g,""));

            if(ship != null){

                $('#last_money').val(vMonney(sum+ship));
                //console.log(vMonney(sum+ship));
            }
        }
      
    });
    $('body').on('click','.icb',function(e){
        //console.log('xx');
        if($(this).parent().find('input').is(':checked')) {
            var parent = $(this);
            parent.closest('li').find('#km_input input').each(function(){
                $(this).prop('disabled', false);
            });
        }else{
            var parent = $(this);
            parent.closest('li').find('#km_input input').each(function(){
                $(this).prop('disabled', true);
            });
        }
    });
    $('#hinh_thuc_nhan_hang').on('change',function(e){
        e.preventDefault();
        var check = $(this).val();
      
        if(check == '1'){ 

            $('#ho_ten').prop("required", true);
            $('#thanh_pho').prop("required", true);
            $('#quan').prop("required", true);
            //$('#phuong').prop("required", true);
            $('#dia_chi').prop("required", true);

            if($("label[for='ho_ten'] small span.require").length == 0) $("label[for='ho_ten'] small").append('<span class="require">*</span>');
            if($("label[for='thanh_pho'] small span.require").length == 0) $("label[for='thanh_pho'] small").append('<span class="require">*</span>');
            if($("label[for='quan'] small span.require").length == 0) $("label[for='quan'] small").append('<span class="require">*</span>');
            //if($("label[for='phuong'] small span.require").length == 0) $("label[for='phuong'] small").append('<span class="require">*</span>');
            if($("label[for='dia_chi'] small span.require").length == 0) $("label[for='dia_chi'] small").append('<span class="require">*</span>');
         
        }else{
            
            $('#ho_ten').prop("required", false);
            $('#thanh_pho').prop("required", false);
            $('#quan').prop("required", false);
            $('#phuong').prop("required", false);
            $('#dia_chi').prop("required", false);

            $("label[for='ho_ten'] small span.require").remove();
            $("label[for='thanh_pho'] small span.require").remove();
            $("label[for='quan'] small span.require").remove();
            $("label[for='phuong'] small span.require").remove();
            $("label[for='dia_chi'] small span.require").remove();
        }
    });
});