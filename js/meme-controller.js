'use strict';

let gElCanvas
let gCtx
let gImg
let gStartPos


function renderEditor() {
    document.querySelector('header h2').innerText = 'Style & share'
const meme = getMeme()
const currLine = meme.lines[meme.selectedLineIdx]


        let strHtmls = `
        <div class="canvas-container">
            <canvas class="my-canvas" width="500" height="500"></canvas>
        </div>
        <section class="control-section">
            <h2 class="control-title">Controls</h2>
            <div class="form-group">
                <div class="input-group mb-3">
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="inputGroupFile02"
                            onchange="onFileInputChange(event)">
                        <label class="custom-file-label" for="inputGroupFile02">Choose file</label>
                    </div>
                </div>
            </div>
            <div class="control-tools">




                <div class="control-text">
                    <button class="line-delete" onclick="onDeleteText()"><i class="fas trash fa-trash-alt"></i></button>

                    <input class="text-input" type="text" placeholder="${currLine.txt}" oninput="onChageTxt(value)" />

                    <i class="fas fa-text-height"></i>

                    <input type="range" value="${currLine.size}" min="10" step="2" oninput="onChangeSize(value)">

                    <i class="fas fa-font"></i>:
                    <input type="color" class="color-input" value="${currLine.color}" oninput="onChangeColor(value)">


                    <select oninput="onChangeFont(value)">
                        <option style="font-family: Impact;" value="${currLine.fontFamily}">
                            Font</option>
                        <option style="font-family: Tahoma;" value="Tahoma">Tahoma</option>
                        <option style="font-family: lobster;" value="lobster">Lobster</option>
                        <option value="Verdana">Verdana</option>
                    </select>

                    <button class="switch-line" onclick="onSwitchLine()">switch-line</button>

                    <i class="fas fa-arrows-alt-h"></i>
                    <input type="number" class="left-right-input" value="${currLine.pos.x}" min="0" step="5"
                        oninput="onChangeX(value)">

                    <i class="fas fa-arrows-alt-v"></i> <input type="number" class="left-right-input" value="${currLine.pos.y}"
                        min="0" step="5" oninput="onChangeY(value)">

                    <select oninput="onChangeAlign(value)">
                        <option value="left">left</option>
                        <option value="center">center</option>
                        <option value="right">right</option>
                    </select>

                </div>

                <!-- Tools Render Here -->



            </div>
            <div class="emoji">
                <button class="btn" data-emoji="heart" onclick="onAddEmoji(this)">💘</button>
                <button data-emoji="angel" onclick="onAddEmoji(this)" class="btn">😇</button>
                <button data-emoji="laugh" onclick="onAddEmoji(this)" class="btn">🤣</button>
                <button data-emoji="sun" onclick="onAddEmoji(this)" class="btn">😎</button>
                <button data-emoji="sleep" onclick="onAddEmoji(this)" class="btn">😴</button>
            </div>

            <button class="btn" onclick="onAddNewLine()">Add New Line <i class="fas fa-grip-lines"></i></button>

            <button class="btn" onclick="onFlexible()">I'm flexible</button>

            <button class="btn" onclick="onSaveMeme()">Save Meme </button>

            <button class="btn" onclick="onDownloadImg()">Download Image <i
                    class="fas fa-cloud-download-alt"></i></button>

            <button class="btn fb-share-btn" type="submit">Share on Facebook <i
                    class="fab fa-facebook-square"></i></button>

        `
    document.querySelector('.editor').innerHTML = strHtmls
    // renderControls()
    createCanvas()
}

function renderMeme() {
    resizeCanvas()
    loadImg()
    drawCanvas()
    addListeners()
}

//Render set's of control each linef
function renderControls() {
    let memes = getMeme()
    let strHtml = memes.txts.map(() => {
        return `


`
    })
    document.querySelector('.control-tools').innerHTML = strHtml.join('')
}

function loadImg() {
    let ImgIdx = loadFromStorage('imgIdx')
    gImg = new Image()
    if (!ImgIdx) gImg.src = `imgs/${gMeme.selectedImgId}.jpg`
    else gImg.src = 'imgs/3.jpg'
}


function createCanvas() {
    gElCanvas = document.querySelector('.my-canvas')
    gCtx = gElCanvas.getContext('2d')

}

function drawCanvas() {
    gCtx.drawImage(gImg, 0, 0, gElCanvas.width, gElCanvas.height)
    let meme = getMeme()
    meme.lines.forEach(line => drawTxt(line))
    markSelected()
}

function markSelected() {
    for (let i = 0; i < gMeme.lines.length; i++) {
        let line = gMeme.lines[i]
        if (i === gMeme.selectedLineIdx) {
            gCtx.strokeRect(line.pos.x - 5, line.pos.y - line.size * 1.4, line.size * 10, line.size * 2)
        }
    }
}

function drawTxt(line) {

    gCtx.beginPath()
    gCtx.fillStyle = line.color
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 3
    gCtx.font = line.size + 'px ' + line.fontFamily
    gCtx.textAlign = line.align

    // console.log('line: ', line)

    gCtx.fillText(line.txt, line.pos.x, line.pos.y)
    gCtx.strokeText(line.txt, line.pos.x, line.pos.y)
}

function onChageTxt(val) {
    setLineTxt(val)
    drawCanvas()
}

function onChangeSize(val) {
    setLineSize(val)
    drawCanvas()
}

function onChangeColor(val) {
    setLineColor(val)
    drawCanvas()
}

function onChangeFont(val) {
    setLineFont(val)
    drawCanvas()
}

function onChangeAlign(val) {
    setLineAlign(val)
    drawCanvas()
}

function onSwitchLine() {
    switchLine()
    drawCanvas()
}

function onChangeX(val) {
    console.log('val: ', val)
    changeX(val)
    drawCanvas()
}

function onChangeY(val) {
    console.log('val: ', val)
    changeY(val)
    drawCanvas()
}

function onDeleteText() {
    deleteText()
    drawCanvas()
}

function onAddNewLine() {
    addNewLine()
    drawCanvas()
}

function onControlOpen() {
    document.querySelector('.control-section').classList.toggle('transform-control')
}


//Get Picture from computer
function renderCanvasImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    reader.onload = function (event) {
        let img = new Image()
        img.src = event.target.result
        img.onload = () => onImageReady(img)
    }
    reader.readAsDataURL(ev.target.files[0])
}

//Download canvas as .jpg

function onDownloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-img.jpg'
}



function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}


function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    const pos = getEvPos(ev)
    if (!isLineClicked(pos)) return
    renderMeme()
    setLineDrag(true)
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const meme = getMeme()
    const isDrag = meme.lines[meme.selectedLineIdx].isDrag
    if (!isDrag) return
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    console.log('dx: ', dx)
    moveLine(dx, dy)
    gStartPos = pos
    renderMeme()
}

function onUp() {
    console.log('Up')
    setLineDrag(false)
    document.body.style.cursor = 'default'
    renderMeme()
}


function onFlexible() {
    createFlexible()
}

function onSaveMeme() {
    saveMeme()
    renderSavedMemes()
}

function onLoadSavedMeme(idx) {
    createCanvas()
    loadSavedMeme(idx)
    renderMeme()
}

function onDeleteSavedMeme(idx){
    deleteSavedMeme(idx)
    renderSavedMemes()
}

function onAddEmoji(elEmoji){
console.log(elEmoji.dataset.emoji)
let emojiName = elEmoji.dataset.emoji
addNewEmoji(emojiName)
drawCanvas()
}