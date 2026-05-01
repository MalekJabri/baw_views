## change

```js
var processCircle = this.context.element.getElementsByTagName("div").ProgressCircle;
console.log(processCircle);
var maxValue = this.getOption("MaxValue");
var minValue= this.getOption("MinValue");
processCircle.setAttribute("aria-valuenow",this.getData());
processCircle.setAttribute("style","--value:"+this.getData() +"; --min: "+minValue+"; --max: "+maxValue+";");
processCircle.setAttribute("data-post",this.getOption("postParameter"));
processCircle.setAttribute("aria-valuemin", minValue);
processCircle.setAttribute("aria-valuemax", maxValue);

```
