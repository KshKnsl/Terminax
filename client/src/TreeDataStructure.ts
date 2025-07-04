class Node {
  id: string;
  label: string;
  children: Node[];
  constructor(id: string = "", label: string = "") {
    this.id = id;
    this.label = label;
    this.children = [];
  }
}

class TreeSt {
  children: Node[];
  root: Node;
  constructor(edgeArray: string[]) {
    this.children = [];

    if (edgeArray.length === 0) {
      this.root = new Node("empty", "empty");
      return;
    }

    const firstPath = edgeArray[0].split("/");
    this.root = new Node(firstPath[0], firstPath[0]);

    for (let i = 0; i < edgeArray.length; i++) {
      let branchString = edgeArray[i];
      let branchArray = branchString.split("/");
      let currentNode = this.root;
      let currentPath = branchArray[0];

      for (let j = 1; j < branchArray.length; j++) {
        let label = branchArray[j];
        currentPath += "/" + label;
        let existingChild = currentNode.children.find((child) => child.label === label);

        if (existingChild) currentNode = existingChild;
        else {
          let childNode = new Node(currentPath, label);
          currentNode.children.push(childNode);
          currentNode = childNode;
        }
      }
    }

    this.sorter(this.root);
  }

  private sorter(node: Node): void {
    node.children.forEach((child) => this.sorter(child));

    node.children.sort((a, b) => {
      const aChildCount = a.children.length;
      const bChildCount = b.children.length;

      if (aChildCount > 0 && bChildCount === 0) return -1;
      if (aChildCount === 0 && bChildCount > 0) return 1;

      if (aChildCount > 0 && bChildCount > 0) {
        return bChildCount - aChildCount;
      }

      return a.label.localeCompare(b.label);
    });
  }
}
export default TreeSt;
