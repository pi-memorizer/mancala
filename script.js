function init()
{
    team = 0
    board = []
    playing = true;
    turnMessage = getTurnMessage()
    dotColors = ["white","black","yellow"]
    for(let i = 0; i < 10; i++)
    {
        let spot = []
        spot.width = 100
        spot.index = i;
        if(i<4)
        {
            spot.x = 100*i+150
            spot.y = 300
            spot.height = 100
            spot.color = "red"
            spot.onClick = spotClick;
        } else if(i==4)
        {
            spot.x = 550
            spot.y = (400-150)/2
            spot.height = 150
            spot.width = 150
            spot.color = "pink"
            spot.onClick = nothing
        } else if(i<9)
        {
            spot.x = 450-100*(i-5)
            spot.y = 0
            spot.height = 100
            spot.color = "green"
            spot.onClick = spotClick
        } else {
            spot.x = 0
            spot.y = (400-150)/2
            spot.height = 150
            spot.width = 150
            spot.color = "cyan"
            spot.onClick = nothing
        }
        spot.dots = []
        if(i!=4&&i!=9)for(let j = 0; j < 4; j++)
        {
            spot.dots.push(getRandomDot())
        }
        board[i] = spot
    }
    for(let i = 0; i < 10; i++)
    {
        board[i].next = board[(i+1)%10]
    }
    var canvas = document.getElementById("canvas")
    context = canvas.getContext("2d")
}

function handleClick(event)
{
    var x = event.offsetX;
    var y = event.offsetY;
    
    if(playing){
        for(let i = 0; i < 10; i++)
        {
            if(board[i].x<=x&&x-board[i].width<board[i].x&&
            board[i].y<=y&&y-board[i].height<board[i].y)
            {
                board[i].onClick(board[i])
                break;
            }
        }
    } else {
        if(x>=160&&x<=540&&y>=150&&y<=200)
        {
            init()
        }
    }
    updateBoard();
}

function nothing() {}

function spotClick(spot)
{
    if(team!==(spot.index<5?0:1))
    {
        let message = [];
        message.text = "Not your turn!";
        message.color = "black";
        turnMessage = message;
        updateBoard()
        setTimeout(function(){turnMessage = getTurnMessage(); updateBoard()},2000)
        return
    }
    if(spot.dots.length==0)
    {
        let message = [];
        message.text = "Empty pit!";
        message.color = "black";
        turnMessage = message;
        updateBoard();
        setTimeout(function() {turnMessage = getTurnMessage(); updateBoard()},2000);
        return;
    }
    let stack = []
    let current = spot
    while(spot.dots.length>0) stack.push(spot.dots.pop())
    while(stack.length>0)
    {
        current = current.next
        current.dots.push(stack.pop())
    }
    if(current.dots.length==1)
    {
        if((team==0&&current.index>=0&&current.index<4)||
        (team==1&&current.index>=5&&current.index<9))
        {
            while(board[8-current.index].dots.length>0)
            {
                (team==0?board[4]:board[9]).dots.push(board[8-current.index].dots.pop())
            }
        }
    }
    if(!((team==0&&current.index==4)||(team==1&&current.index==9)))
    {
        team = 1 - team
    }
    turnMessage = getTurnMessage()

    updateBoard()
}

function getTurnMessage()
{
    var message = [];
    message.text = "It is player " + (team+1) + "'s turn";
    message.color = team == 0 ? "red" : "green"

    if(board.length==0)
    {
        return message
    }

    let teamLeft = 0;
    if(team==0)
    {
        for(let i = 0; i < 4; i++) teamLeft += board[i].dots.length
    } else if(team==1)
    {
        for(let i = 5; i < 9; i++) teamLeft += board[i].dots.length;
    }
    if(teamLeft==0)
    {
        playing = false;
        if(team==0)
        {
            for(let i = 5; i < 9; i++)
            {
                while(board[i].dots.length>0)
                {
                    board[9].dots.push(board[i].dots.pop())
                }
            }
        } else if(team==1)
        {
            for(let i = 0; i < 4; i++)
            {
                while(board[i].dots.length>0)
                {
                    board[4].dots.push(board[i].dots.pop())
                }
            }
        }

        message.color = "black";

        if(board[4].dots.length>board[9].dots.length)
        {
            message.text = "Red team wins!";
        } else if(board[4].dots.length<board[9].dots.length)
        {
            message.text = "Green team wins!";
        } else {
            message.text = "It's a tie!";
        }
    }

    return message
}

function getRandomDot()
{
    var dot = []
    dot.color = dotColors[Math.floor(Math.random() * dotColors.length)]
    let radius = Math.random()*40
    let angle = Math.random()*2*Math.PI
    dot.x = radius*Math.cos(angle)
    dot.y = radius*Math.sin(angle)
    dot.width = 20
    dot.height = 20
    return dot
}

function updateBoard()
{
    context.fillStyle = "white"
    context.fillRect(0,0,canvas.width,canvas.height);
    context.font = "36px Arial"
    context.fillStyle = turnMessage.color;
    context.fillText(turnMessage.text,0,436)
    for(let i = 0; i < 10; i++)
    {
        let spot = board[i];
        context.fillStyle = spot.color;
        context.beginPath();
        context.arc(spot.x+spot.width/2,spot.y+spot.height/2,spot.width/2,0,2*Math.PI)
        context.fill();
        for(let j = 0; j < spot.dots.length; j++)
        {
            let dot = spot.dots[j];
            context.fillStyle = dot.color;
            context.beginPath();
            context.arc(spot.x+spot.width/2+dot.x,spot.y+spot.height/2+dot.y,dot.width/2,0,2*Math.PI)
            context.fill();
        }
        if(i==4||i==9)
        {
            context.font = "36px Arial";
            context.fillStyle = "black";
            context.fillText(spot.dots.length,spot.x,spot.y+36+spot.height);
        }
        //context.fillRect(spot.x,spot.y,spot.width,spot.height)
    }
    if(!playing)
    {
        context.fillStyle = "grey";
        context.fillRect(160,150,380,50);
        context.font = "36px Arial";
        context.fillStyle = "black";
        context.fillText("Play again",250,150+43);
    }
}

init()
updateBoard()
document.getElementById("canvas").addEventListener("click",handleClick)