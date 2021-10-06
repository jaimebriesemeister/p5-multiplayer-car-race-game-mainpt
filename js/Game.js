class Game {
  getState(secret_word) {
    var gameStateRef = db.ref(`users/${secret_word}/game_state/`);
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }

  update(state) {
    db.ref(`users/${secret_word}/`).update({
      game_state: state,
    });
  }

  async start() {
    // Quando usuário visita a página
    if (gameState === null) {
      welcome.display();
    }

    // //Quando usuário fizer login com sucesso
    if (gameState === 0) {
      var playerCountRef = await db
        .ref(`users/${secret_word}/player_count/`)
        .once("value");

      if (playerCountRef.exists()) {
        playerCount = playerCountRef.val();
        player.getCount();
      }
    }
  }

  play() {
    Player.getPlayerInfo();
    player.getCarsAtEnd();

    if (allPlayers !== undefined) {
      background("#464646");
      image(track, 0, -height * 4, width, height * 5);

      //var display_position = 100;

      //índice da matriz
      var index = 0;

      //posições x e y dos carros
      var x = width / 2 - 680;
      var y;

      for (var plr in allPlayers) {
        //adiciona 1 ao índice para cada loop
        index = index + 1;

        //posicionar os carros um pouco afastados do outro na direção x
        x = x + 455;
        //usar dados do banco de dados para exibir os carros na direção y
        y = height - allPlayers[plr].distance;
        cars[index - 1].x = x;
        cars[index - 1].y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);
          cars[index - 1].shapeColor = "red";
          camera.position.x = width / 2;
          camera.position.y = cars[index - 1].y;
        }
      }
    }

    if (keyIsDown(UP_ARROW) && player.index !== null) {
      player.distance += 10;
      player.update();
    }

    if (player.distance > height * 5 - 100) {
      gameState = 2;
      player.rank += 1;
      Player.updateCarsAtEnd(player.rank);
      swal({
        title: `Incrível!${"\n"}Ranking${"\n"}${player.rank}`,
        text: "Você atingiu a linha final com sucesso",
        imageUrl:
          "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        imageSize: "100x100",
        confirmButtonText: "Ok",
      });
    }

    drawSprites();
  }

  end() {}
}
