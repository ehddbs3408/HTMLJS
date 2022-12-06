export default class TooltipHelper
{
    tooltipBox:HTMLDivElement;
    msgSpan:HTMLSpanElement;

    constructor()
    {
        this.tooltipBox = document.querySelector("#tooltip") as HTMLDivElement;
        this.msgSpan = this.tooltipBox.querySelector(".msg")as HTMLSpanElement;
    }

    showTooltip(parent:HTMLElement,target:HTMLElement,offset:number,msg:string):void
    {
        let parentRect = parent.getBoundingClientRect();
        let targetRect = target.getBoundingClientRect();

        let {x:tx,y:ty} = targetRect;
        let {x:px,y:py} = parentRect;

        let pos = {x: tx - px,y:ty - py};

        this.tooltipBox.style.top = `${pos.y + offset}px`;
        this.tooltipBox.style.left = `${pos.x}px`;

        this.msgSpan.innerHTML = msg;

        this.tooltipBox.classList.add("on");
    }

    closeTooltip():void
    {
        this.tooltipBox.classList.remove("on");
    }
}