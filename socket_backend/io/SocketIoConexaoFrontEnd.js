const phantom = require('phantom');
const cheerio = require('cheerio');
const url = require('url');
const request = require('request');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const shortid = require('shortid');
require('../bd/Schemas/imgUrlSchema');

const ImgModelo = mongoose.model('urlSchema')
 let _ft, _pag;
 module.exports = function(io){
    io.sockets.on('connection',(socket)=>{
        console.log(`Usuário ${socket.id} conectou`);
        socket.on('teste',(data)=>{
         phantom.create().then((ph)=>{
             _ft = ph;
             return _ft.createPage();
         }).then((page)=>{
             _pag = page;
             return _pag.open(data.urlToScrap);
         }).then((status)=>{
             //console.log(status);
             return _pag.property('content')
         }).then((content)=>{
             html = content;
             const $ = cheerio.load(html);
             const imagens = $('img');
             let imagensPathLista = [];
             let imagensPathServidorLista =[];
             let hostScrap = url.parse(data.urlToScrap,true)
             let hostScrapFullPath = `${hostScrap.protocol}//${hostScrap.host}`;
             imagens.each((index,el)=>{
                 if($(el).attr('src')=== undefined){
                     socket.emit('img',"erro")
                 }else if($(el).attr('src').charAt(0) == 'h' ){
                    imagensPathLista.push($(el).attr('src'));
                 }else if($(el).attr('src').charAt(1) == '/'){
                    imagensPathLista.push(`${hostScrap.protocol}${$(el).attr('src')}`);
                 }else{
                    imagensPathLista.push(`${hostScrapFullPath}${$(el).attr('src')}`)
                 }; 
             });
             const dir = `public/${hostScrap.host}_${shortid.generate()}`
             if (!fs.existsSync(dir)){
                 fs.mkdirSync(dir);
             };
             imagensPathLista.forEach((imgUrl,index)=>{
                 const fileExten = path.extname(imgUrl);
                 request(imgUrl).pipe(fs.createWriteStream(`${dir}/${index}${fileExten}`).on('error',erro=>{
                     console.log(erro)
                 }));
                 process.on('uncaughtException', err => {
                    //socket.emit('img',"erro");
                  });
                 let pathImg = path.relative(process.cwd(), `./${dir}/${index}${fileExten}`).split('public')
                 imagensPathServidorLista.push(`http://localhost:3000${pathImg[1]}`);  
             });
             let modeloImg = new ImgModelo({
                 urlSite: data.urlToScrap,
                 imgPath: imagensPathServidorLista
             });
             modeloImg.save()
             .then(()=>{}); 
             _pag.close()
             _ft.exit().then(()=>{
                ImgModelo.findOne({urlSite:data.urlToScrap})
                .then((data)=>{
                   socket.emit('img',data.imgPath)
                })
                //console.log(socket.id)
            });
         }).catch((e)=>{
         console.log(e); 
         });  
          
        });
        console.log(socket.rooms) 
      });
    };