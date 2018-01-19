# Simple DiffJS
A simple vanilla JS lib that compare two objects

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

This project haven't prerequisites, only pure Javascript was used.

### Installation

Using NPM

``` npm install simple-diff-js ```

Using Bower

``` bower install simple-diff-js ```

Add the simple-diff.js script tag 

```<script src="src/simple-diff.js"></script> ```

### Usage

Call object SimpleDiffJs and use.

``` SimpleDiffJs.simpleDiff(object1, object2, false); ```

## Available methods

### ```simpleDiff(object1, object2, false)```: 
Function that compare two objects and overload the first with properties called ```"[property]_changed"```;
#### Params 
* ```object1```: The new version of the object that will be compared, this object will be overloaded with dynamic properties called ```"[originalPropertyName]_changed"``` with the result.
* ```object2```: The old version of the object that will be compared.
* ```false```: This argument define what kind of comparison will used, strict compare or type-converting compare if don't informed, by default, the kind of compare will be strinct. ```true``` = strinct compare, ```false``` = type-converting compare
