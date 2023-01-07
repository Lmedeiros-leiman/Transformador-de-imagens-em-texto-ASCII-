const canvasfinal = document.getElementById("imagemfinal");
const canvasinicial = document.getElementById("imageminicial");
const entradavideo = document.getElementById("entradavideo");
const contextoinicial = canvasinicial.getContext("2d");
const contextofinal = canvasfinal.getContext("2d");
const inputwebcam = document.getElementById("bwebcam");
const inputarquivo = document.getElementById("arquivo");
const pre = document.getElementById("resultadoascii");


function desligarwebcam() 
{
    const video = entradavideo.srcObject;
    if (video != null) {
    console.log("Video: "+video);
    entradavideo.srcObject = null;

    limparcanvas(canvasfinal);
    limparcanvas(canvasinicial);
    }

}

function gravar(botao) {
    
    if (entradavideo.srcObject == null) {
        botao.innerHTML = "Parar de gravar.";
        console.log("pegando midias...");
        navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
    
        if (navigator.getUserMedia) { 
            navigator.getUserMedia(
                {
                audio:false,
                video: true
                }, function(video) {
                //Em caso de sucesso chama a função de sucesso:
                    entradavideo.srcObject = video;
                    

                    entradavideo.onloadedmetadata = (e) => 
                    { 
                        entradavideo.play(); 
                    }

                    

                    entradavideo.addEventListener("play", function(){
            
                        desenhar(this /*Video*/, contextoinicial , this.width, this.height );
                
                    }, false);

                                                                        
                }, function(error){
                //em caso de erro, chama esta função
                console.log("Deu erro :)");
                if (error.name == "NotAllowedError") { console.log("O erro é por falta de permisão.");}
            });
            
            

    } else {
        console.log("sem suporte. atualize o navegador.");
    }
}else{
    botao.innerHTML = "pegar video da webcam";
    desligarwebcam();

    }
}

function pintar(arquivo) 
{
    arquivo = arquivo.files[0];
    const imagem = new Image;
    imagem.onload = function()
    {
        console.log("Imagem carregada!");
        desenhar(imagem, canvasinicial ,contextoinicial, imagem.width, imagem.height);
    }
    imagem.src = URL.createObjectURL(arquivo);
    

}

function ajustardimensoes(largura,altura)
{

    const altura_maxima = 80;
    const largura_maxima = 80;

    var larguraajustada = largura_maxima;
    //var larguraajustada = largura;
    if (altura > altura_maxima) 
    {
        var largurareduzida = Math.floor(larguraajustada * altura_maxima / altura);
        return [largurareduzida, altura_maxima];
    }

    if (largura > largura_maxima) 
    {
        var alturareduzida = Math.floor(altura * largura_maxima / larguraajustada);
        return [largura_maxima, alturareduzida];
    }

    return[larguraajustada,altura];
};

function desenhar(fonte,canvas ,contexto, largura, altura) 
{
    canvas.width = largura;
    canvas.height = altura;

    contexto.drawImage(fonte,0,0,largura,altura);
    
    desenharpretoebranco(fonte, contextofinal, largura, altura)

    const video = entradavideo.srcObject;
    if (video != null) {
    setTimeout(desenhar,10, fonte, contexto, largura, altura);
    }
}



function desenharpretoebranco(fonte,contexto,largura,altura)
{
    largura = 40;
    altura = 40;
    contexto.drawImage(fonte,0, 0,largura,altura);
    var dadosimagem = contexto.getImageData(0,0, largura,altura);
    
    
    var pixeiscinzas = [];
    
    for(var i = 0 ; i < dadosimagem.data.length; i += 4)
    {
        var r = dadosimagem.data[i];
        var g = dadosimagem.data[i+1];
        var b = dadosimagem.data[i+2];

        var media = (r + g + b) / 3;

        dadosimagem.data[i] = dadosimagem.data[i+1] = dadosimagem.data[i+2] = media;
        pixeiscinzas.push(media);
    }
    
    
    contexto.putImageData(dadosimagem, 0, 0);
    //largura = contexto.width = 20;
    //altura = contexto.height = 20;
    //largura = redimensionarimagem();

    escreverpixeis(pixeiscinzas,largura);

}


//
// Configurações sombra.
//

const letras = "Ñ@#W$9876543210?!abc;:+=-,._        ";
const letrasinvertidas = letras.split("").reverse().join("");
const tletras = letras.length;
//
//
//
function escreverpixeis(pixeiscinzas,largura) 
{
    var texto = pixeiscinzas.reduce((resultadoascii, escalacinza, indexador) =>
    {
        var caractere = letrasinvertidas[Math.ceil((tletras - 1) * escalacinza / 255)];

        if ((indexador + 1) % largura == 0) 
        {
            caractere += '\n';
            
        }
        
        return resultadoascii + caractere;
    }, '');
    
    pre.innerHTML = texto;
    
}

function limparcanvas(canvas) 
{
    contexto = canvas.getContext("2d");
    contexto.clearRect(0,0, canvas.width, canvas.height);
}

function mudarradio(radio)
{
    if (radio.value == "webcam") 
    {
        inputwebcam.style.visibility = "visible";
        inputarquivo.style.visibility = "hidden";
    }
    else 
    {
        inputwebcam.style.visibility = "hidden";
        inputarquivo.style.visibility = "visible";
        desligarwebcam();

    }
}
