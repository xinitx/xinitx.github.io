
var title=document.title; 
// window 失去焦点 
    window.onblur = function() { 
    document.title='(つ ェ ⊂)我藏好了哦~';
};
// window 获得焦点 
    window.onfocus = function() { 
    document.title='(*゜ロ゜)ノ被发现了~'; 
    setTimeout("document.title=title",3000); 
}

