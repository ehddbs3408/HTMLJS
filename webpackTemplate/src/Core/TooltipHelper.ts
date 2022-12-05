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

        console.log(parentRect);
        console.log(targetRect);
    }
}