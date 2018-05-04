
$(function(){
    $('#thanh_pho').selectize({
        onChange: function(value) {
            sumAddress();
            $('#quan').prop('disabled', false);
            $('#quan').html('');
            $('#phuong').html('');
            $('#phuong').append('<option value="">chọn phường/xã</option>');
            //$('#phuong').prop('disable', true);
            $.post(window.location.origin + '/auth/quan',{title:value},function(data){
                $('#quan').append('<option value="">chọn quận/huyện</option>');
                $.each(data, function(index, element) {
                    $('#quan').append('<option value="'+element.id+'">'+element.full_title+'</option>');
                });
            });
            setTimeout(function(){
                $('#phuong').prop('disable', true);
            },2000);
            
        }
    });
    $('#quan').on('change',function(){
        sumAddress();
        $('#phuong').html('');
        $('#phuong').prop('disabled', false);
        
        var value=$('#quan').val();
       
        $.post(window.location.origin + '/auth/phuong',{title:value},function(data){
            $('#phuong').append('<option value="">chọn phường/xã</option>');
          
            $.each(data, function(index, element) {
                $('#phuong').append('<option value="'+element.id+'">'+element.full_title+'</option>');
            });
        });
    });
    $('#phuong').on('change',function(){
        sumAddress();
    });
});
$('.save-cus').on('click',function(e){
    e.preventDefault();
    var cf = confirm("Lưu nhanh thông tin khách hàng?");
    if(cf){

        var ho_ten = $('#ho_ten').val();
        var dien_thoai_1 = $('#dien_thoai_1').val();

        var pattern = /^([0-9]{10,11})$/.test(dien_thoai_1);
        if (!pattern) {
            alert("Số điện thoại bạn nhập chưa hợp lệ!");
            $('#dien_thoai_1').focus();
            return false;
        }
        var dien_thoai_2 = $('#dien_thoai_2').val();
        var dia_chi = $('#dia_chi').val();
        var thanh_pho  =$('#thanh_pho').val();
        var quan = $('#quan').val();
        var phuong = $('#phuong').val();
        var tuoi = $('#tuoi').val();
        var gioi_tinh = $('#gioi_tinh').val();
        var email = $('#email').val();

        console.log(ho_ten + dien_thoai_1 + dien_thoai_2 + dia_chi + thanh_pho + quan + phuong + tuoi + gioi_tinh + email);
      
        $.post(window.location.origin + "/auth/customer",{
            ho_ten:ho_ten,
            dien_thoai_1:dien_thoai_1,
            dien_thoai_2:dien_thoai_2,
            dia_chi:dia_chi,
            thanh_pho:thanh_pho,
            quan:quan,
            phuong:phuong,
            tuoi:tuoi,
            gioi_tinh:gioi_tinh,
            email:email
            },function(data,status){
                if(data.code==0){
                    alert("Khách hàng đã tồn tại!");
                    return false;
                }
                if(data.code==1){
                    alert('Thêm khách hàng thành công');
                    return false;
                }
                // console.log(status);
                // console.log(data);
                if(status=="error"){
                    alert('Lỗi: Thêm thất bại!');
                }

        });
    }
    });