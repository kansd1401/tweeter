$(() => {
  $('textarea').keyup(function(){
    let char = 140-$(this).val().length
    $('#counter').text(char)
    if(char < 0){
      $('#counter').css('color','#ff0000')
    }else{
      $('#counter').css('color','#000000')
    }
  });
});
