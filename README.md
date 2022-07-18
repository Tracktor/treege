<div align="center">
  <img alt="Treege" src="https://raw.githubusercontent.com/Tracktor/treege/main/src/assets/img/treege-white.png" style="padding: 20px; max-height:100px; width: auto;" />
</div>

<div align="center">
  <strong>Treege is a tools for decision tree generator</strong>
</div>

## Embed

#### Treege can be easily embed  in any HTML page.

```html
<!doctype html>
<html lang="en">
<head>
    <title>Treege Iframe</title>
    <style>
        html,
        body,
        iframe {
            overflow: hidden;
            margin: 0;
            height: 100%;
            width: 100%;
            border: 0;
        }
    </style>
</head>
<body>

<iframe src="{{YOUR_TREEGE_URL}}"></iframe>

</body>
</html>
```

#### Data can be passed to iframe

```javascript
const iframe = document.querySelector("iframe");

iframe.addEventListener("load", handleLoadIframe);

function handleLoadIframe() {
    const tree = {
        attributes: {
            depth: 0,
            disabled: false,
            isLeaf: true,
            isRoot: true,
            paths: ["Age"],
            required: false,
            type: "select",
        },
        children: [],
        name: "Age",
    }

    setTimeout(() => {
        iframe.contentWindow.postMessage({source: "treege", tree, type: "setTree"}, "*");
    }, 100);
}
```

#### Listen Treege event

```javascript
const iframe = document.querySelector("iframe");

window.addEventListener('message', handleMessage);

function handleMessage(event) {
    // On save event is trigger from iframe
    if (event.origin === "{{YOUR_TREEGE_URL}}" && event.data.type === "onSave" && event.data.source === "treege") {
        // Get tree data from Treege
        console.log(event.data.tree);
    }
}
```

### Events available
#### List of events that can be listened

| Event name | Data                                       |
|------------|--------------------------------------------|
| onSave     | `{source: "treege", type : "onSave, tree}` |

#### Liste des événements pouvant être envoyés

| Event name | Data                                        |
|------------|---------------------------------------------|
| setTree    | `{source: "treege", type : "setTree, tree}` |