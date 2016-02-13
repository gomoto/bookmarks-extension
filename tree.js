


/*** TreeNode ***/



function TreeNode(data, parent) {
    this.data = data;
    this.parent = parent || null;
    this.children = [];
}

/*
findForward
Forwardly traverse (pre-order, depth-first) tree rooted at this
TreeNode until callback returns true.
Return null or first node for which callback returns true.
*/
TreeNode.prototype.findForward = function(callback) {
    return findForward(this, callback);
};

/*
Forwardly traverse (pre-order, depth-first) tree rooted at given node
until callback returns true.
Return null or first node for which callback returns true.
*/
function findForward(node, callback) {
    if (callback(node))
        return node;
    for (var i=0; i < node.children.length; i++) {
        foundNode = findForward(node.children[i], callback);
        if (foundNode)
            return foundNode;
    }
    return null;
}

/*
next
Like findForward but excludes starting node.
Return null or first node for which callback returns true.
*/
TreeNode.prototype.next = function(callback) {
    var node = this;
    // search children of this subtree
    for (var i=0; i < node.children.length; i++) {
        var foundNode = findForward(node.children[i], callback);
        if (foundNode)
            return foundNode;
    }
    return null;
};

/*
findBackward
Backwardly traverse (post-order, depth-first) tree rooted at this
TreeNode until callback returns true.
Return null or first node for which callback returns true.
*/
TreeNode.prototype.findBackward = function(callback) {
    return findBackward(this, callback);
};

/*
Backwardly traverse (post-order, depth-first) tree rooted at given node
until callback returns true.
Return null or first node for which callback returns true.
*/
function findBackward(node, callback) {
    for (var i=node.children.length-1; i >= 0; i--) {
        foundNode = findBackward(node.children[i], callback);
        if (foundNode)
            return foundNode;
    }
    if (callback(node))
        return node;
    return null;
}

/*
previous
Like findBackward but excludes starting node.
Return null or first node for which callback returns true.
*/
TreeNode.prototype.previous = function(callback) {
    var node = this;
    // Search children of this subtree backwardly
    for (var i=node.children.length-1; i >= 0; i--) {
        foundNode = findBackward(node.children[i], callback);
        if (foundNode)
            return foundNode;
    }
    return null;
};

/*
findForwardRootward
Forwardly traverse (pre-order, depth-first) tree rooted at this
TreeNode until callback returns true. Then continue traversing
the rest of the global tree to which this node belongs.
Return null or first node for which callback returns true.
*/
TreeNode.prototype.findForwardRootward = function(callback) {
    return findForwardRootward(this, callback);
};

function findForwardRootward(node, callback) {
    // Search this node, its subtree, its SUBSEQUENT siblings, and their subtrees
    var parent = node.parent;
    if (!parent)
        return null;
    var index = parent.children.indexOf(node);//guaranteed to return an index
    for (var i=index; i < parent.children.length; i++) {
        var foundNode = findForward(parent.children[i], callback);
        if (foundNode)
            return foundNode;
    }

    // Recursively search up the tree
    var grandparent = parent.parent;
    if (!grandparent)
        return null;
    var parentIndex = grandparent.children.indexOf(parent);//guaranteed to return an index
    var uncle = grandparent.children[parentIndex + 1];
    if (!uncle)
        return null;
    var foundNode = findForwardRootward(uncle, callback);
    if (foundNode)
        return foundNode;
    return null;
}

/*
nextRootward
Like findForwardRootward but excludes starting node.
Return null or first node for which callback returns true.
*/
TreeNode.prototype.nextRootward = function(callback) {
    var node = this;

    // Search this subtree, excluding starting node
    for (var i=0; i < node.children.length; i++) {
        var foundNode = findForward(node.children[i], callback);
        if (foundNode)
            return foundNode;
    }

    // Search siblings subtrees
    var parent = node.parent;
    if (!parent)
        return null;
    var index = parent.children.indexOf(node);//guaranteed to return an index
    for (var i=index+1; i < parent.children.length; i++) {
        var foundNode = findForward(parent.children[i], callback);
        if (foundNode)
            return foundNode;
    }

    // Recursively search up the tree
    var grandparent = parent.parent;
    if (!grandparent)
        return null;
    var parentIndex = grandparent.children.indexOf(parent);//guaranteed to return an index
    var uncle = grandparent.children[parentIndex + 1];
    if (!uncle)
        return null;
    var foundNode = findForwardRootward(uncle, callback);
    if (foundNode)
        return foundNode;
    return null;
};

/*
findBackwardRootward
Backwardly traverse (post-order, depth-first) tree rooted at this
TreeNode until callback returns true. Then continue traversing
the rest of the global tree to which this node belongs.
Return null or first node for which callback returns true.
*/
TreeNode.prototype.findBackwardRootward = function(callback) {
    return findBackwardRootward(this, callback);
};

function findBackwardRootward(node, callback) {
    // Search this node, and search sibling subtrees backwardly
    if (callback(node))
        return node;
    var parent = node.parent;
    if (!parent)
        return null;
    var index = parent.children.indexOf(node);//guaranteed to return an index
    for (var i=index-1; i >= 0; i--) {
        var foundNode = findBackward(parent.children[i], callback);
        if (foundNode)
            return foundNode;
    }

    // Recursively search up the tree
    var foundNode = findBackwardRootward(parent, callback);
    if (foundNode)
        return foundNode;
    return null;
};

/*
previousRootward
Like findBackwardRootward but excludes starting node.
Return null or first node for which callback returns true.
*/
TreeNode.prototype.previousRootward = function(callback) {
    var node = this;
    // Search sibling subtrees backwardly
    var parent = node.parent;
    if (!parent)
        return null;
    var index = parent.children.indexOf(node);//guaranteed to return an index
    for (var i=index-1; i >= 0; i--) {
        var foundNode = findBackward(parent.children[i], callback);
        if (foundNode)
            return foundNode;
    }

    // Recursively search up the tree
    var foundNode = findBackwardRootward(parent, callback);
    if (foundNode)
        return foundNode;
    return null;
};

/*
append
Add a node to the end of the list of children of this node.
Return new node if it was appended, or return null.
*/
TreeNode.prototype.append = function append(data) {
    var node = this;
    var newNode = new TreeNode(data, node);
    node.children.push(newNode);
    return newNode;
};

/*
insert
Insert a node at a given position into the list of children of this node.
Return new node if it was inserted, or return null.
*/
TreeNode.prototype.insert = function insert(position, data) {
    assertTypeof(position, 'number');
    var node = this;
    var newNode = new TreeNode(data, node);
    node.children.splice(position, 0, newNode);
    return newNode;
};

/*
detach
Detach this node from its tree.
Return node or null if it has no parent.
*/
TreeNode.prototype.detach = function detach() {
    var node = this;
    var parent = node.parent;
    if (!parent)
        return null;
    node.parent = null;
    var index = parent.children.indexOf(node);
    parent.children.splice(index, 1);
    return node;
};





/*** Tree ***/





function Tree(nodes) {
    // private dummy root node
    var root = new TreeNode();
    root.children = construct(nodes, root);

    // construct nodes into list of TreeNodes
    function construct(nodes, parent) {
        var treeNodes = [];
        for (var i=0; i < nodes.length; i++) {
            var node = nodes[i];
            var treeNode = new TreeNode(node.data, parent);
            treeNode.children = construct(node.children, treeNode);
            treeNodes.push(treeNode);
        }
        return treeNodes;
    }

    /* Add methods to Tree instead of Tree.prototype to keep root private */

    /*
    printForward
    Print tree (pre-order, depth-first).
    */
    this.printForward = function printForward() {
        for (var i=0; i < root.children.length; i++) {
            forward(root.children[i], function(node, depth) {
                console.log(Array(depth+1).join('  '), node.data);
            });
        }
    };

    /*
    printBackward
    Print tree in reverse (post-order, depth-first).
    */
    this.printBackward = function printBackward() {
        for (var i=root.children.length-1; i >= 0; i--) {
            backward(root.children[i], function(node, depth) {
                console.log(Array(depth+1).join('  '), node.data);
            });
        }
    };

    /*
    findForward
    Forwardly traverse (pre-order, depth-first) tree until callback returns true.
    Excludes root node.
    Return null or first node for which callback returns true.
    */
    this.findForward = function(callback) {
        return root.next(callback);
    };

    /*
    findBackward
    Backwardly traverse (post-order, depth-first) tree until callback returns true.
    Exclude root node.
    Return null or first node for which callback returns true.
    */
    this.findBackward = function(callback) {
        return root.previous(callback);
    };

    /*
    append
    Add a node to the end of the list of children of the first node for which callback returns true.
    Return new node if it was appended, or return null.
    */
    this.append = function append(data, callback) {
        var node;
        if (!callback)
            node = root;
        else
            node = root.next(callback);
        if (!node)
            return null;
        return node.append(data);
    };

    /*
    insert
    Insert a node at a given position into the list of children of the first node for which callback returns true.
    Return new node if it was inserted, or return null.
    */
    this.insert = function insert(position, data, callback) {
        var node;
        if (!callback)
            node = root;
        else
            node = root.next(callback);
        if (!node)
            return null;
        return node.insert(position, data);
    };

    /*
    detach
    Detach first node where callback returns true. Error if no callback provided.
    Return detached node if one was detached, or return null.
    */
    this.detach = function detach(callback) {
        assertInstanceof(callback, Function);
        var node = root.next(callback);
        if (!node)
            return null;
        return node.detach();
    };

}





/*
forward
Forwardly traverse (pre-order, depth-first) entire tree rooted at given node,
calling callback on each node.
*/
function forward(node, callback, depth) {
    if (!depth)
        depth = 0;
    callback(node, depth);
    for (var i=0; i < node.children.length; i++) {
        forward(node.children[i], callback, depth + 1);
    }
}

/*
backward
Backwardly traverse (post-order, depth-first) entire tree rooted at given node,
calling callback on each node.
*/
function backward(node, callback, depth) {
    if (!depth)
        depth = 0;
    for (var i=node.children.length-1; i >= 0; i--) {
        backward(node.children[i], callback, depth + 1);
    }
    callback(node, depth);
}





/*
assertTypeof
Return instance {primitive} if type {String} is correct. Otherwise throw error.
*/
function assertTypeof(instance, type) {
    if (typeof instance !== type)
        throw 'Error: Not an instance of ' + type;
    return instance;
}
/*
assertInstanceof
Return instance if type is correct. Otherwise throw error.
*/
function assertInstanceof(instance, type) {
    if (!(instance instanceof type))
        throw 'Error: Not an instance of ' + type.name;
    return instance;
}



// data used once to construct tree nodes
var nodes = [{
    data: { name: 'Parent 1', isOpen: false },
    children: [{
        data: { name: 'Child 1-1', isOpen: false },
        children: [{
            data: { name: 'Grandchild 1-1-1', isOpen: false },
            children: []
        }, {
            data: { name: 'Grandchild 1-1-2', isOpen: false },
            children: []
        }]
    }, {
        data: { name: 'Child 1-2', isOpen: false },
        children: []
    }, {
        data: { name: 'Child 1-3', isOpen: false },
        children: []
    }]
}, {
    data: { name: 'Parent 2', isOpen: false },
    children: []
}, {
    data: { name: 'Parent 3', isOpen: false },
    children: [{
        data: { name: 'Child 3-1', isOpen: false },
        children: [{
            data: { name: 'Grandchild 3-1-1', isOpen: false },
            children: []
        }]
    }]
}];

var tree = new Tree(nodes);
