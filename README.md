### Benchmark Analysis: CPU-Bound vs. I/O-Bound Endpoints

**Objective**

The goal of this project is to measure and compare the performance of a single-threaded Node.js server when handling two different types of tasks: a CPU-bound (synchronous) task and an I/O-bound (asynchronous) task.

**Methodology**

*   **Server:** An Express.js server was created with two endpoints.
    *   `/cpu`: A synchronous route that blocks the main thread with a `for` loop counting to 5 billion.
    *   `/io`: An asynchronous route that reads a small text file from the disk.
    *   `/cpu-worker`: An asynchronous route that offloads the same heavy for loop to a separate Worker Thread.
*   **Tool:** The `autocannon` load generator was used to send 10 concurrent connections to each endpoint.

**Results**

| Endpoint | Task Type | Average Requests/Sec |
| :--- | :--- | :--- |
| **/cpu** | Blocking CPU-Bound (Synchronous) | **0.2** |
| **/io** | I/O-Bound (Asynchronous) | **~8,376** |
| **/cpu-worker** | Non-Blocking CPU-Bound (Asynchronous) | **~2.0** |


**Analysis & Conclusion**

The results show a dramatic performance difference.

1.  **The `/cpu` endpoint performed poorly** because its synchronous code is **blocking**. The single main thread gets completely occupied by the `for` loop from the first request. It cannot start processing the second request until the first one is entirely finished. This forces requests to be handled one by one, leading to extremely low throughput.

2.  **The `/io` endpoint performed exceptionally well** because `fs.readFile` is **non-blocking**. When a request arrives, Node.js hands the file-reading task off to the operating system. The main thread is instantly free to handle the next request. This allows the server to manage thousands of concurrent requests efficiently.

3. **The `/cpu-worker` endpoint demonstrates the power of multi-threading**. By moving the heavy calculation to a `Worker` Thread, we unblocked the main thread. The server was able to handle 10 times more requests per second (2.0 vs 0.2) than the blocking /cpu endpoint. This proves the main thread remained responsive and could accept new work while the heavy computation happened in the background.