//背包只能计算整数
//01背包
function bag01(weight,value,capacity){
    let n=value.length;
    let table=[];
    table[-1]=new Array(capacity+1).fill(0);//添加-1行，便不用把第一行单独处理
    for(let i=0;i<n;i++){//i表示物品id
        table[i]=[];
        for(let c=0;c<=capacity;c++){//c表示容量,从0到capacity,共capacity+1个        
            if(c<weight[i]){
                table[i][c]=table[i-1][c];
            }
            else{
                table[i][c]=Math.max(table[i-1][c],table[i-1][c-weight[i]]+value[i]);
            }
        }
    }
    //回溯
    let j=capacity;
    let true_capacity=0;
    let putin_id=[];
    let count=0;
    for(let i=n-1;i>=0;i--){
        if(table[i][j]>table[i-1][j]){//即背包内放入了该物品
            putin_id[count++]=i;
            //console.log("放入了id为"+i+"的物品，其重量为"+weight[i]+"价值为"+value[i]);
            j-=weight[i];
            true_capacity+=weight[i];
        }
    }
    //console.log("实际放入总质量为"+true_capacity+"最大价值为"+table[n-1][capacity]);
    //动画效果
    let num=weight.length;
    let article_div=document.getElementById("article_div");
    let result=document.getElementById("result");
    for(let i=0;i<num;i++){
        let article=document.createElement("span");//生成小物品
        article.id=i;
        article.innerHTML=i;
        if(putin_id.indexOf(i)!=-1){
            article.className="article_put";
            let a=document.createElement("h3");
            a.innerHTML="放入了id为"+i+"的物品,其重量为"+weight[i]+"价值为"+value[i];
            result.appendChild(a);
        }
        else{
            article.className="article";
        }
        article_div.appendChild(article);
    }
    let a=document.createElement("h3");
    a.className="result_detail";
    a.innerHTML="实际放入总质量为"+true_capacity+"最大价值为"+table[n-1][capacity];
    result.appendChild(a);  
}
//多重背包
function bag_duochong(weight,value,numbers,capacity){
    let n=weight.length;
    let new_weight=[],new_value=[];//创建新的重量数组和价值数组
    let new_id=0;//表示新的等价的01物品的id
    let new_to_old_id=[];//表示new_id对应的原来的id
    let new_to_old_num=[];//表示每个01物品是原来物品的多少倍，即是原来物品的多少份
    let cou=0;
    for(let i=0;i<n;i++){
        let w=weight[i];
        let v=value[i];
        let num=numbers[i];
        for(let j=1;;j=j*2){//把每个物品的数量用二进制的一组数表示，如100=1+2+4+8+16+32+17
            if(num>=j){     //新生成的打包物品称为01物品
                new_weight[new_id]=j*w;
                new_value[new_id]=j*v;
                num=num-j;
                new_id++; 
                new_to_old_num[cou]=j;
                new_to_old_id[cou++]=i;
            }
            else{
                if(num!=j&&num!=0){
                    new_weight[new_id]=num*w;
                    new_value[new_id]=num*v; 
                    new_id++;
                    new_to_old_num[cou]=num;
                    new_to_old_id[cou++]=i;
                }
                break;
            }
        }   
    }
    //此时问题被转化为01背包
   // bag01(new_weight,new_value,capacity);
    let new_n=new_value.length;
    let table=[];
    table[-1]=new Array(capacity+1).fill(0);//添加-1行，便不用把第一行单独处理
    for(let i=0;i<new_n;i++){//i表示物品id
        table[i]=[];
        for(let c=0;c<=capacity;c++){//c表示容量,从0到capacity,共capacity+1个        
            if(c<new_weight[i]){
                table[i][c]=table[i-1][c];
            }
            else{
                table[i][c]=Math.max(table[i-1][c],table[i-1][c-new_weight[i]]+new_value[i]);
            }
        }
    } 

    //回溯一下，看用了哪些物品，每种用几个
    let j=capacity;
    let true_capacity=0;
    let putin_new_id=[];
    let count=0;
    for(let i=new_n-1;i>=0;i--){
        if(table[i][j]>table[i-1][j]){//即背包内放入了该物品
            putin_new_id[count++]=i;
            j-=new_weight[i];
            true_capacity+=new_weight[i];
        }
    }
    let arr=[];//arr表示所有放入的01物品的旧id，会有重复
    for(let j=0;j<putin_new_id.length;j++){
        arr[j]=new_to_old_id[putin_new_id[j]];
    }
    //为动画效果做准备
    let article_div=document.getElementById("article_div");
    let result=document.getElementById("result");

    let repeat_count=1;//repeat_num表示重复的旧id个数
    for(let j=0;j<arr.length;j+=repeat_count){//根据arr里的旧id，判断用了哪些原来的物品，用了多少个
        let article_used_num=new_to_old_num[putin_new_id[j]];//article_used_num表示物品使用个数
        repeat_count=1;
        for(let q=j+1;q<arr.length;q++){
            if(arr[q]===arr[j]){//如有重复的旧id，则累加相应的物品使用个数
                article_used_num=article_used_num+new_to_old_num[putin_new_id[q]];
                repeat_count++;
            }
        }
        let i=new_to_old_id[putin_new_id[j]];
        //生成小物品，做动画效果
        let article=document.createElement("span");
        let number=document.createElement("span");
        let article_and_num=document.createElement("span");
        number.innerHTML="×"+article_used_num;
        article.id=i;
        article.innerHTML=i;
        article.className="article";
        article_and_num.className="article_and_num";
        article_and_num.appendChild(article);
        article_and_num.appendChild(number);
        article_div.appendChild(article_and_num);
        let a=document.createElement("h3");
        a.innerHTML="放入了id为"+i+"的物品，其重量为"+weight[i]+"价值为"+value[i]+"数量为"+article_used_num;
        result.appendChild(a);
    }
    let a=document.createElement("h3");
    a.innerHTML="实际放入总质量为"+true_capacity+"最大价值为"+table[new_n-1][capacity];
    result.appendChild(a);
}

function getvalue(id){
    ele=document.getElementById(id);
    return Number(ele.value);
}
function alert_to_choose(){
    alert("请先选择背包类型！");
}
function choose_01(){
    let create_table=document.getElementById("create_table");
    create_table.onclick=function(){
        createtable_01();
    }
}
function choose_duo(){
    let create_table=document.getElementById("create_table");
    create_table.onclick=function(){
        createtable_duo();
    }
}
function createtable_01(){
    let ele=document.getElementById("num");
    let num=ele.value;
    let table=document.getElementById("detailsetting_table");
    let arr=["id","weight","value"];
    createtable(arr,table,num);
}
function createtable_duo(){
    let ele=document.getElementById("num");
    let num=ele.value;
    let table=document.getElementById("detailsetting_table");
    let arr=["id","weight","value","number"];
    createtable(arr,table,num);
}
function createtable(arr,table,num){//arr是表格第一列的文字说明，table是要添加的元素，num是物品个数
    for(let i=0;i<arr.length;i++){//arr有几个元素，就创建几排
                                  //但arr只能是["id","weight","value"]或["id","weight","value","number"]
        let tr=document.createElement("tr");
        for(let j=0;j<=num;j++){//创建num+1列，第一列放字，后面放id
            let td=document.createElement("td");
            if(j===0){
                td.innerHTML=arr[i];
            }
            else{ 
                if(i===0){td.innerHTML=j-1;}//id
                else if(i===1){td.innerHTML="<input type='text' class='weights'>"}
                else if(i===2){td.innerHTML="<input type='text' class='values'>"}
                else{td.innerHTML="<input type='text' class='numbers'>"}
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
        tr.id=arr[i];
    }
}
function run(){
    let result_detail=document.getElementsByClassName("result_detail");
    let capacity=getvalue("capacity");
    if(result_detail.length!=0){
        alert("已经运行过了");
        return 0;
    }
    if(capacity===0){
        alert("请先填写信息");
        return 0;
    }
    let weight=[],value=[];
    let weights=document.getElementsByClassName('weights');
    let values=document.getElementsByClassName('values');
    let numbers=document.getElementsByClassName('numbers');
    if(numbers.length===0){
        for(let i=0;i<weights.length;i++){
            weight[i]=Number(weights[i].value);
            value[i]=Number(values[i].value);
        }
        bag01(weight,value,capacity);
    }
    else{ 
        let number=[];
        for(let i=0;i<weights.length;i++){
            weight[i]=Number(weights[i].value);
            value[i]=Number(values[i].value);
            number[i]=Number(numbers[i].value);
        }
        bag_duochong(weight,value,number,capacity);
    }  
}
function clear_all(){
    let detailsetting_input=document.getElementsByClassName("detailsetting_input");//清空输入框
    for(let i=0;i<detailsetting_input.length;i++){
        detailsetting_input[i].value='';
    }
    let table=document.getElementById("detailsetting_table");//清空表格、小物品和运行结果
    let article_div=document.getElementById("article_div");
    let result=document.getElementById("result");
    table.innerHTML='';
    article_div.innerHTML='';
    result.innerHTML='';
    let create_table=document.getElementById("create_table");
    create_table.onclick=function(){
        alert_to_choose();
    }
}
