// Minimal JS for MVP
document.addEventListener('DOMContentLoaded',function(){
  var el=document.querySelectorAll('.btn-demo');
  el.forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();alert('デモページに移動します（開発中）');})})
});
