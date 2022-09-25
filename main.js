//  캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas)

// 이미지를 불러오는 함수 만들기. 먼저 필요한 변수 선언
let backgroundImage,spaceshipImage,bulletImage,enemyImage,gaemOverImage;
// 게임의 상태값을 저장할 변수 선언. 초기값은 당연히 false
let gameOver=false  // ture이면 게임오버, false 이면 게임이 계속.
// 점수 변수 선언 및 초기화 0
let score=0;
// 우주선 좌표 별도 생성(랜덤 이므로...)
let spaceshipX = canvas.width/2-32
let spaceshipY = canvas.height-64

let bulletList=[]  // 총알들을 저장하는 리스트
function Bullet(){
  this.x=0;
  this.y=0;
  // 총알의 위치를 초기화 하는 함수를 만든다. 우주선의 좌료 이용하여...
  this.init=function(){
    this.x=spaceshipX+23;
    this.y=spaceshipY+8;
    this.alive=true // true이면 살아있는 총알, false 이면 죽은 총알
    bulletList.push(this);  // 위에서 만든 총알저장 리스트에 this(=Bullet()) 를 넣어준다.
  }
  // 총일이 발사되도록 y좌료 값을 빼준다.
  this.update = function(){
    this.y-=7;
  };
  // 총알과 적군 접촉 체크
  this.checkHit=function(){
    for(let i=0; i<enemyList.length;i++){
      if(this.y <= enemyList[i].y && this.x>=enemyList[i].x&&this.x<=enemyList[i].x+64){
        // 총알이 죽고 적군이 없어지고, 점수 획득
        score++;
        this.alive=false // 죽은 총알
        enemyList.splice(i,1);
      }
    }
  };
}
// 적 랜덤(최소,최대 ) 함수 만들기  Math.random() 내장함수 이용
function generateRandomValue(min,max){
  let randomNum = Math.floor(Math.random()*(max-min+1))+min  // 내림함수 Math.floor 사용
  return randomNum
}
// 적 만들기 class 개념의 함수로 this 사용
let enemyList=[]  // 만든 적을 배열로 만들어 넣어 주어야 함.
function Enemy(){
  this.x=0;  // x,y 위치 값이 필요하면 초기 0 으로 설정
  this.y=0;
  // 적 초기화 필요
  this.init=function(){
    this.y=0; // 최 상단 위치
    this.x=generateRandomValue(0,canvas.width-64)
    enemyList.push(this)
  };
  this.update=function(){
    this.y+=2;  // 적군의 속도 조절

  if(this.y >= canvas.height-48){
    gameOver = true;
    console.log("gameover");
   }
  }
}

function loadImage(){
  backgroundImage = new Image();
  backgroundImage.src="images/background.png"

  spaceshipImage = new Image();
  spaceshipImage.src="images/spaceship.png"

  bulletImage = new Image();
  bulletImage.src="images/bullet.png"

  enemyImage = new Image();
  enemyImage.src="images/enemy.png"

  gameOverImage = new Image();
  gameOverImage.src="images/gameOver.png"
}

// 방향키를 누르면 함수 만들기
// 어떤 버튼이 눌렸는지  변수에 저장
let keysDown={}
function setupKeyboardListener(){
  document.addEventListener("keydown",function(event){
    keysDown[event.keyCode]=true;
    console.log("키다운객체에 들어간 값은?",keysDown);
  });
  document.addEventListener("keyup",function(event){
    delete keysDown[event.keyCode];

    // 총알이 스페이스바를 누르고 뗀 순간에 발사되도록 keyup 에 함수를 만든다.
    // 누르는 순간 발사되면 연속발사 가능하여 게임의 난이도 하락.
    if(event.keyCode==32){
      createBullet() // 총알 생성 함수
    }
  });
}

// 총알 만들기
function createBullet(){
  console.log("총알 생성");
  let b = new Bullet()   // Bullet()함수를 새로 만들어 b 에 저장한다. 총알 하나 생성
  b.init();
  console.log("새로운 충알 리스트",bulletList);
}

// 적 만들기
function createEnemy(){
  // 1초 마다 적 생성하기 위해서 내장함수 setInterval(호출함수,시간) 사용
  const interval = setInterval(function(){
    let e = new Enemy()
    e.init()
  },1000)  // 1초 : 단위가 ms 이므로 1000으로 해야 1초
}

// 이미지를 그려주는 함수 만들기
function render(){
  ctx.drawImage(backgroundImage,0,0,canvas.width,canvas.height);
  ctx.drawImage(spaceshipImage,spaceshipX,spaceshipY);
  // 점수 보여주기
  ctx.fillText(`Score:${score}`,20,20);
  ctx.fillStyle="white";
  ctx.font='20px Arial';

  //총알이 보이도록 랜던실시
  for(let i=0;i<bulletList.length;i++){
    // 만약 살아있는 총알이면 보여주고
    if(bulletList[i].alive){
      ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
    }
  }

  // 적이 보이도록 랜던실시
  for(let i=0;i<enemyList.length;i++){
    ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
  }
}

// 우주선 움직이기
function update(){
  if(39 in keysDown){
    spaceshipX+=3;
  } // right
  if(37 in keysDown){
    spaceshipX-=3;
  } // left
  // if(38 in keysDown){
  //   spaceshipY-=3;
  // } // up
  // if(40 in keysDown){
  //   spaceshipY+=3;
  // } // down
  // 우주선 좌표가 무한대로 경기장안 한정
  if(spaceshipX <= 0){
    spaceshipX=0;
  }
  if(spaceshipX >= canvas.width-64){
    spaceshipX=canvas.width-64;
  }

  // 총알의 y좌표 업데이트 함수 호출
  for(let i=0;i<bulletList.length;i++){
    if(bulletList[i].alive){
      bulletList[i].update();
      // 총알이 적군을 쳤는지 매번 체크
      bulletList[i].checkHit();
    }
  }
  // 적군의 y좌표 업데이트 함수 호출
  for(let i=0;i<enemyList.length;i++){
    enemyList[i].update();
  }
}

// 함수를 만들고 불러줘야 실행된다.(화면에 나타난다.)
function main(){
  if(!gameOver){
    update();  // 게임의 원리는 좌표값을 업데이트하고
    render();  // 그려주고의 반복이다
    requestAnimationFrame(main)  //애니메이션 구현 내장함수 : requestAnimationFrame(반복할 함수)
  }else{
    ctx.drawImage(gameOverImage,70,300,250,150);
  }

}
loadImage();
setupKeyboardListener();
createEnemy();  // 게임시작과 동시에 적 생성.
main();


// 방향키를 누르면
// 우주선의 xy좌표가 바뀌고
// 다시 render 그려준다.


// 총알 만들기
// 1. 스페이스바를 누르면 총알 발사
// 2. 총알 발사 = 총알의 y 좌표 값이 -, x값은? 스페이스바를 누른 순간의 우주선의 x 좌표
// 3. 발사된 총알들은 총알 배열에 저장을 한다.
// 4. 총알들은 x,y좌표값이 있어야 한다.
// 5. 총알 배열을 가지고 render 그련준다.

// 적 만들기 - x,y,init,update
// 위치가 랜덤
// 적이 아래로 내려온다  = y 좌료가 증가한다.
// 1초마다 적 나온다.
// 바닥에 닿으면 게임 오버
// 적과 총알이 만나면 우주선 사라지고 1점 획득


// 적군이 죽는다
// 총알이 적군에게 닿는다 -> 총알.y <= 적군.y And 총알.x >= 적군.x <=적군.x + 적군의 넓이
// 총알 사망 및 적군 사망 없어짐. 점수 획득
