import { useState, useRef } from "react";
//import styles
import "./styles/app.scss";

//adding components
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";

// import util
import data from "./data";

function App() {
    //Ref
    const audioRef = useRef(null);
    //state
    const [songs, setSongs] = useState(data());
    const [currentSong, setCurrentSong] = useState(songs[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songInfo, setSongInfo] = useState({
        currentTime: 0,
        duration: 0,
        animationPercentage: 0,
    });
    const [libraryStatus, setLibraryStatus] = useState(false);
    //functions
    const timeUpdateHandler = (e) => {
        const current = e.target.currentTime;
        const duration = e.target.duration;

        //Calculate percentage
        const roundedCurrent = Math.round(current);
        const roundedDuration = Math.round(duration);

        const animation = Math.round((roundedCurrent / roundedDuration) * 100);

        setSongInfo({
            ...songInfo,
            currentTime: current,
            duration: duration,
            animationPercentage: animation,
        });
    };
    const activeLibraryHandler = (nextPrev) => {
        const newSongs = songs.map((songClicked) => {
            if (songClicked.id === nextPrev.id) {
                return {
                    ...songClicked,
                    active: true,
                };
            } else {
                return {
                    ...songClicked,
                    active: false,
                };
            }
        });
        setSongs(newSongs);
        if (isPlaying) audioRef.current.play();
    };
    
      const songEndHandler = async () => {
          let currentIndex = songs.findIndex(
              (song) => song.id === currentSong.id
          );
          await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
          activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
          if (isPlaying) audioRef.current.play();
          return;
      };
    return (
        <div className={`App ${libraryStatus ? "library-active" : ""}`}>
            <Nav
                libraryStatus={libraryStatus}
                setLibraryStatus={setLibraryStatus}
            />
            <Song isPlaying={isPlaying} currentSong={currentSong} />
            <Player
                setSongs={setSongs}
                setCurrentSong={setCurrentSong}
                songs={songs}
                songInfo={songInfo}
                setSongInfo={setSongInfo}
                audioRef={audioRef}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentSong={currentSong}
            />
            <Library
                libraryStatus={libraryStatus}
                isPlaying={isPlaying}
                setSongs={setSongs}
                audioRef={audioRef}
                songs={songs}
                setCurrentSong={setCurrentSong}
            />
            <audio
                onTimeUpdate={timeUpdateHandler}
                onLoadedMetadata={timeUpdateHandler}
                ref={audioRef}
                src={currentSong.audio}
                onEnded={songEndHandler}
            ></audio>
        </div>
    );
}

export default App;
