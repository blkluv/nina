import ninaCommon from "nina-common";
const { NinaClient } = ninaCommon.utils;

const ReleaseEmbedPage = ({ host, metadata }) => {
  const player = `
    <html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <style>
          body {
            margin: 0px;
          }

          #container {
            height: 565px;
            width: 100%;
            position: relative;
            flex-direction: column;
          }
          
          #vertical-center {
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            -ms-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            display: none;
          }

          #seekbar-container {
            width: 100%;
            height: 8px;
            z-index: 10;
            background-color: black;
            position: absolute;
            bottom: 0;
          }

          #seekbar {
            width: 0%;
            height: 100%;
            background-color: #2D81FF;
            z-index: 100;
            position: relative;
          }

          #image {
            z-index: -1;
          }

          #overlay {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: black;
            display: none;
            opacity: 0.5;
          }

          #title {
            display: block;
            position: absolute;
            z-index: 1000;
            color: white;
            font-family: helvetica;
            margin: 0 auto;
            width: 100%;
            text-align: center;
            display: none;
          }
        </style>
      </head>
      <body>
        <div id="container">
          <div id="overlay"></div>
          <div id="title">
            <h4>NINA</h4>
          </div>
          <div id="vertical-center">
            <input id="player-button" type="image" src="https://${host}/play.svg" width="40px height="40px />
          </div>
          <img id="image" src=${metadata.image} height="100%" width="100%" />
          <div id="seekbar-container">
            <div id="seekbar"></div>
          </div>
          <audio id="nina-player" style={{ width: "100%" }} autoplay>
            <source src=${metadata.animation_url} type="audio/mp3" />
          </audio>
        </div>
      </body>
      <script>
        $(document).ready(function () {
            // Bind the DIV element to the .click() method.
            $("#overlay").click(function () {
              let player = $('#nina-player')[0];
              player[player.paused ? 'play' : 'pause']();
            });
            $("#player-button").click(function () {
              let player = $('#nina-player')[0];
              player[player.paused ? 'play' : 'pause']();
            });
            $('#container').mouseenter(function() {
              $('#vertical-center').eq(0).show();
              $('#overlay').eq(0).show();
              $('#title').eq(0).show();
            })
            $('#container').mouseleave(function() {
              $('#vertical-center').eq(0).hide();
              $('#overlay').eq(0).hide();
              $('#title').eq(0).hide();
            })
            $('#nina-player').on("play", function() {
              let playerButton = $('#player-button')[0];
              playerButton.src = "https://${host}/pause.svg"
            })
            $('#nina-player').on("pause", function() {
              let playerButton = $('#player-button')[0];
              playerButton.src = "https://${host}/play.svg"
            })
            $('#nina-player').on('timeupdate', function() {
              $('#seekbar')[0].style.width = ((this.currentTime / this.duration) * 100) + "%";
            });
            $("#seekbar-container").click(function (e) {
              let player = $('#nina-player')[0];
              let width = $('#seekbar-container')[0].offsetWidth
              let position = e.originalEvent.clientX
              let newTime = (position / width) * player.duration
              player.currentTime = newTime
            });
        });
      </script>
    </html>
  `;
  var dataURI = "data:text/html," + encodeURIComponent(player);
  return (
    <iframe
      id="nina-player"
      width="100%"
      height="565px"
      style={{ border: "none" }}
      src={dataURI}
    />
  );
};

export const getServerSideProps = async (context) => {
  const releasePubkey = context.params.releasePubkey;
  const metadataResult = await fetch(
    `${NinaClient.endpoints.api}/metadata/bulk`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [releasePubkey] }),
    }
  );
  const metadataJson = await metadataResult.json();
  return {
    props: {
      metadata: metadataJson[releasePubkey],
      releasePubkey,
      isEmbed: true,
      host: context.req.headers.host,
    },
  };
};

export default ReleaseEmbedPage;
