use axum::{
    routing::post,
    Router,
    extract::Json,
    http::{StatusCode, Method},
};
use serde::{Deserialize, Serialize};
use tower_http::cors::{CorsLayer, Any};

#[tokio::main]
async fn main() {
    // Set up CORS with more specific configuration
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        // In production, specify exact origins instead of Any
        .allow_origin(Any)
        .allow_headers(Any);

    // Build our application with a single route
    let app = Router::new()
        .route("/add", post(add_numbers))
        .layer(cors);
    // Run the server
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("Server listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

// The input to our `add_numbers` handler
#[derive(Deserialize)]
struct AddRequest {
    a: f64,
    b: f64,
}

// The output from our `add_numbers` handler
#[derive(Serialize)]
struct AddResponse {
    result: f64,
}

// Handler for adding two numbers
async fn add_numbers(
    Json(payload): Json<AddRequest>,
) -> (StatusCode, Json<AddResponse>) {
    let sum = payload.a + payload.b;

    // Return the result with a 200 OK status
    (
        StatusCode::OK,
        Json(AddResponse { result: sum }),
    )
}