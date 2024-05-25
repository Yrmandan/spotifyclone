console.log('Javascript Begins');
let currentSong = new Audio;
let songs
let currfolder;
// let play = document.querySelector("#play")


function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and seconds
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Ensure that minutes and seconds are in two-digit format
    var formattedMinutes = String(minutes).padStart(2, '0');
    var formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    //show all songs in playlist


    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li>
    <img class="invert" src="img/music.svg" alt="">
    <div class="info">
    <div>${song.replaceAll("%20", " ")}</div>
    <div>Author</div>
    </div>
    <div class="playnow">
    
    <span>Play Now</span>
    <img class="invert" src="img/play.svg" alt="">
    </div>
    </li>`;

    }
    //attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (element) => {


            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
return songs
}

const playMusic = (track, pause = false) => {

    currentSong.src = `/${currfolder}/` + track


    //   let audio = new Audio("/songs/" + track)
    if (!pause) {

        currentSong.play()
        play.src = "img/pause.svg"
    }
    // play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    let a = await fetch(`/songs`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {

            let folder = e.href.split("/").slice(-2)[0]
            // console.log(e.href.split("/").slice(-2));
            
            //get meta data
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json()

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}"  class="card ">
                <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" xml:space="preserve"
                width="800" height="800" viewBox="0 0 58 58">
                <circle cx="29" cy="29" r="29" />
                <path d="M44 29 22 44V14z" style="fill:#000000" />
                <path
                d="M22 45a.999.999 0 0 1-1-1V14a.999.999 0 0 1 1.564-.826l22 15a1.001 1.001 0 0 1-.001 1.652l-22 15A1.002 1.002 0 0 1 22 45zm1-29.107v26.215L42.225 29 23 15.893z"
                style="fill:#000000" />
                </svg>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
                </div>`
        }

    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async (item) => {


            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)

        }
        )
    });

}
async function main() {



    //get the list of all the songs
    await getSongs("songs/animal")
    playMusic(songs[0], true)
    //Display all albums on the page
    displayAlbums()



    //attach an event listener to play , nxt , prev
    // play.addEventListener("click", () => {
    // if (currentSong.paused) {
    //     currentSong.play()
    //     play.src = "pause.svg"
    // }
    // else {
    //     currentSong.pause()
    //     play.src = "play.svg"

    // }

    // })



    play.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"

        }
    }
    )

    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    }
    )

    //add an event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"


        currentSong.currentTime = (currentSong.duration) * percent / 100
    }
    )

    //add event listener to hamberger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    }
    )
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    }
    )
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

    //add an event listeners to previous and next
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
            play.src = "img/pause.svg"
        }

    }
    )
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
            play.src = "img/pause.svg"
        }


    }
    )
    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        currentSong.volume = e.target.value / 100
        if(currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    }

    )
    //load the playlist when card is clicked

    // Array.from(document.getElementsByClassName("card")).forEach(e => {
    //     e.addEventListener("click", async (item) => {


    //         songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    //         console.log('hello');


    //     }
    //     )
    // });

    //add event listener to mute

    document.querySelector(".volume>img").addEventListener("click", (e) => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = "0"
            document.querySelector(".range").getElementsByTagName("input")[0].value="0"
            
        }
        else {
            
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10
            document.querySelector(".range").getElementsByTagName("input")[0].value="10"

        }
    }
    )

}
main()