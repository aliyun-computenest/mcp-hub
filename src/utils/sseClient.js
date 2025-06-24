export class SSEClient {
  constructor(url) {
    this.url = url;
    this.eventSource = null;
  }

  connect(onMessage, onError) {
    try {
      this.eventSource = new EventSource(this.url);

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
          onError(error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        onError(error);
        this.disconnect();
      };
    } catch (error) {
      console.error('Failed to establish SSE connection:', error);
      onError(error);
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
