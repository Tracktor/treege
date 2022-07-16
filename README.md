<div align="center">
  <img alt="Treege" src="https://raw.githubusercontent.com/Tracktor/treege/main/src/assets/img/treege-white.png" style="padding: 20px; max-height:100px; width: auto;" />
</div>

<div align="center">
  <strong>Treege is a tools for decision tree generator</strong>
</div>

### Embed Treege

<p>You can easily embed Treege in any HTML page and interact with her.</p>

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

<script>
    (function () {
        const iframe = document.querySelector("iframe");

        iframe.addEventListener("load", handleLoadIframe);
        window.addEventListener('message', handleMessage);

        function handleLoadIframe() {
            const tree = {
                attributes: {
                    depth: 0,
                    disabled: false,
                    isRoot: true,
                    paths: ["Age"],
                    required: false,
                    type: "select",
                },
                children: [],
                name: "Age",
            }

            // Set initial data
            setTimeout(() => {
                iframe.contentWindow.postMessage({source: "treege", tree, type: "initTree"}, "*");
            }, 100);
        }

        function handleMessage(event) {
            // On save event is trigger from iframe
            if (event.origin === "{{YOUR_TREEGE_URL}}" && event.data.type === "onSave" && event.data.source === "treege") {
                // Get tree data from Treege
                console.log(event.data.tree);
            }
        }
    })();
</script>

</body>
</html>
```