<template>
  <div class="home container font-logo">
     <loading :active.sync="isLoading" 
        :can-cancel="false" 
        >
      </loading>
    <div v-if="image && !noImage" class="row formPad">
      <br>
      <div class="col l6 s12 m12 offset-l3 bordaImg grey lighten-5">
        <h5 class="center-align">Digite ou cole o link abaixo!</h5>
        <form>
           <input id="urlScrap" class="validate"  placeholder="Url aqui" @input="$v.urlScrap.$touch()" type="text" :class="{erroInput: $v.urlScrap.$error}" v-model="urlScrap">
          <p class= "helper-text center-align red-text text-lighten-3" v-if="!$v.urlScrap.url">Url inválida</p>
          <button v-if="urlScrap" class="btn green accent-4 bgBtn font-logo" @click="scrapIt" :disabled="$v.$error"><v-icon name="smile-wink" scale="1"/> SCRAP IT <v-icon name="smile-wink" scale="1"/></button>
        </form>
        <br>
      </div>
    </div>
    <br>
    <button v-if="newScrap" class="btn blue darken-4 bgBtn font-logo" @click="resetar" :disabled="$v.$error"><v-icon name="thumbs-up" scale="1"/> SCRAP AGAIN <v-icon name="thumbs-up" scale="1"/></button>
      <div  v-if="!noImage" class="row">
        <div v-for="data in imgUrl" v-bind:key="data.id"  class="col s12 l3">
          <div class="card small bordaImg">
            <div class="card-image">
              <div class="card-content bgCardImg"></div>
              <img class="responsive-img" :src="data">
            </div>
            <div class="card-action bordaImg bgCardAction">
              <a  target="_blank" :href="`${data}`"><v-icon name="download" scale="1"/></a>
            </div>
          </div>
      </div>
      </div>
      <div v-if="noImage" class="row"><h2 class="formPad center-align green-text text-accent-4"><v-icon name="frown" scale="4"/> Não achamos nenhuma imagem... <v-icon name="frown" scale="4"/></h2></div>
  </div>
</template>

<script>
import{ required, url } from 'vuelidate/lib/validators';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
export default {
  name: 'home',
  data(){
    return{
      urlScrap:"",
      room:'',
      imgUrl: null,
      image: true,
      noImage: false,
      isLoading: false,
      newScrap: false,
    }
  },
  components:{
    Loading
  },
  sockets:{
    connect: function (socket) {
      console.log('Conectado')
    }
  },
  validations:{
    urlScrap:{
      required,
      url
    }
  },
  methods:{
    scrapIt: function () {
      event.preventDefault();
      this.$socket.emit('teste',{
        urlToScrap: this.urlScrap,
      });
    this.isLoading = true;
    this.sockets.subscribe('img', (data) => {
    this.imgUrl = data
    if(data === 'erro'){
      this.noImage = true;
      this.newScrap = true;
    }else{
      this.image = false;
      this.newScrap =true;
    }
    
    this.sockets.unsubscribe('img');
    this.isLoading = false;
});

    },
    resetar(){
         window.location.reload()
      },
  }
  
};
</script>
