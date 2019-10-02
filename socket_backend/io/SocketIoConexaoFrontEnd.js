const url = require('url');
const request = require('request');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const shortid = require('shortid');
const puppeteer = require('puppeteer');
require('../bd/Schemas/imgUrlSchema');

const ImgModelo = mongoose.model('urlSchema')
 module.exports = function(io){
    io.sockets.on('connection',(socket)=>{
        console.log(`Usuário ${socket.id} conectou`);
        socket.on('teste',(data)=>{
            (async () => {
                try {
                    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
                  const page = await browser.newPage();
                  await page.goto(data.urlToScrap);
              
                const imgs = await page.$$eval('img[src]', imgs => imgs.map(img => img.getAttribute('src')));
                 
                let imagensPathLista = [];
                let imagensPathServidorLista =[];
                const hostScrap = url.parse(data.urlToScrap,true)
                const hostScrapFullPath = `${hostScrap.protocol}//${hostScrap.host}`;
                if(imgs.length === 0){
                    socket.emit('img',"erro") 
                }else{
                    imgs.forEach((imgUrl)=>{
                        if(imgUrl.charAt(0) === 'h'){
                            imagensPathLista.push(imgUrl);
                        }else if(imgUrl.charAt(1) === '/'){
                            imagensPathLista.push(`${hostScrap.protocol}${imgUrl}`);
                        }else{
                            imagensPathLista.push(`${hostScrapFullPath}${imgUrl}`);
                        } 
                    });
                };
                const pathId = shortid.generate();
                const dir = `public/${hostScrap.host}_${pathId}`;
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir,{ recursive: true });
                   };
                imagensPathLista.forEach((imgUrl,index)=>{
                    const fileExten = path.extname(imgUrl);
                        request(imgUrl).pipe(fs.createWriteStream(`${dir}/${index}${fileExten}`).on('error',erro=>{
                            console.log(erro)
                        }));
                        process.on('uncaughtException', err => {
                            return err
                        });
                        const pathImg = path.relative(process.cwd(), `./${dir}/${index}${fileExten}`).split('public')
                            imagensPathServidorLista.push(`https://scrappyroo.herokuapp.com${pathImg[1]}`);  
                        });
                        const modeloImg = new ImgModelo({
                            urlSite: data.urlToScrap,
                            imgPath: imagensPathServidorLista,
                            pathId: pathId
                        });
                        modeloImg.save()
                        .then(()=>{
                            ImgModelo.findOne({pathId})
                            .then((data)=>{
                                socket.emit('img',data.imgPath)
                            })
                        });
                  await browser.close();
                } catch (error) {
                  console.log(error);
                }
            })();
        });
      });
    };
