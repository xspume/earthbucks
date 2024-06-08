use std::env;
use tensorflow::ops;
// use tensorflow::Graph;
use tensorflow::Scope;
use tensorflow::Session;
use tensorflow::SessionOptions;
use tensorflow::SessionRunArgs;
use tensorflow::Tensor;

fn add() {
    // our goal is to write a test program using rust tensorflow
    // it is very simple: we want to add two numbers together

    // first, we need to create a scope
    let scope = &mut Scope::new_root_scope();

    // now we need to create two constants
    let a = ops::constant(3.0f32, scope).unwrap();
    let b = ops::constant(4.0f32, scope).unwrap();

    // now we need to add the two constants together
    let c = ops::add(a, b, scope).unwrap();

    // now we need to create a session
    let graph = scope.graph();
    let session = Session::new(&SessionOptions::new(), &graph).unwrap();

    // now we need to run the session
    let mut args = SessionRunArgs::new();

    // Request a fetch for the output of the add operation
    let token = args.request_fetch(&c, 0);

    // now we need to run the session
    session.run(&mut args).unwrap();

    // now we need to get the result
    let result: Tensor<f32> = args.fetch(token).unwrap();

    // now we need to print the result
    println!("result: {}", result[0]);
}

fn mul() {
    // our goal is to write a test program using rust tensorflow
    // it is very simple: we want to add two numbers together

    // first, we need to create a scope
    let scope = &mut Scope::new_root_scope();

    // now we need to create two constants
    let a = ops::constant(3.0f32, scope).unwrap();
    let b = ops::constant(4.0f32, scope).unwrap();

    // now we need to add the two constants together
    let c = ops::mul(a, b, scope).unwrap();

    // now we need to create a session
    let graph = scope.graph();
    let session = Session::new(&SessionOptions::new(), &graph).unwrap();

    // now we need to run the session
    let mut args = SessionRunArgs::new();

    // Request a fetch for the output of the add operation
    let token = args.request_fetch(&c, 0);

    // now we need to run the session
    session.run(&mut args).unwrap();

    // now we need to get the result
    let result: Tensor<f32> = args.fetch(token).unwrap();

    // now we need to print the result
    println!("result: {}", result[0]);
}

fn main() {
    // Get the command-line arguments
    let args: Vec<String> = env::args().collect();

    // Check if an argument was provided
    if args.len() > 1 {
        match args[1].as_str() {
            "add" => add(),
            "mul" => mul(), // assuming you have a function named mul
            _ => println!("Unknown command"),
        }
    } else {
        println!("Please provide a command");
    }
}
