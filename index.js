const core = require("@actions/core");
const xpath = require("xpath");
const DOMParser = require("xmldom").DOMParser;
const fs = require("fs");

try {
    const filename = core.getInput("filename");
    const expression = core.getInput("expression");
    const namespaces = core.getInput("namespaces");

    const content = fs.readFileSync(filename, "utf8");
    const document = new DOMParser().parseFromString(content);
    const select = namespaces
        ? xpath.useNamespaces(JSON.parse(namespaces))
        : xpath.select;
 
    const result = {};
    const nodes = select(expression, document);

    nodes.forEach((node) => {
        // If attribute, map values
        if (node.name) {
            result[node.name] = node.value;
            return;
        }
        result[node.tagName] = node.toString();
    });

    core.setOutput("result", JSON.stringify(result));
} catch (error) {
    core.setFailed(error.message);
}
