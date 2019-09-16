<template>
  <div id="app">
    <nav class="green accent-4 font-logo">
    <div class="nav-wrapper">
      <a class="brand-logo center">Scrapyroo</a>
    </div>
  </nav>
     <keep-alive include="home">
    <router-view/>
  </keep-alive> 
  </div>
</template>

<style>
  .font-logo{
    font-family: 'Luckiest Guy', cursive;
  }
  .erroInput{
    background-color: #ef9a9a !important;
  }
  .erroLabel{
    color: #b71c1c !important;
    
  }
  .bgBtn{
    width: 100% !important;
    border-radius: 15px !important;
  }
  .imgCard{
    max-width: 200px !important;
    max-height: 200px !important;
  }
  .bordaImg{
    border: 2px solid #00c853 !important
  }
  .bgCardImg{
    background-color: #eeeeee !important
  }
  .bgCardAction{
    background-color: #757575 !important
  }
  .formPad{
    padding-top:60px;
  }
</style>
