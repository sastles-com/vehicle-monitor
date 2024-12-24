// src/lib/websocket.ts
export function createWebSocketConnection(
  url: string,
  onMessage: (data: string) => void,
  onOpen?: () => void,
  onClose?: () => void
) {
  let ws: WebSocket;
  let reconnectTimeout: NodeJS.Timeout;

  const connect = () => {
    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket接続成功');
      if (onOpen) onOpen();
    };

    ws.onmessage = (event) => {
      try {
        onMessage(event.data);
      } catch (error) {
        console.error('Message handling error:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket切断 - 再接続を試みます...');
      if (onClose) onClose();
      
      // 3秒後に再接続
      reconnectTimeout = setTimeout(connect, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.close(); // エラー時に接続を閉じて、onCloseのハンドラで再接続
    };
  };

  connect(); // 初期接続

  // クリーンアップ用の関数を返す
  return {
    close: () => {
      clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    }
  };
}



// export function createWebSocketConnection(
//     url: string, 
//     onMessage: (data: string) => void,
//     onOpen?: () => void,
//     onClose?: () => void
//   ) {
//     const ws = new WebSocket(url);
    
//     ws.onopen = () => {
//       console.log('WebSocket接続成功');
//       onOpen && onOpen();
//     };
  
//     ws.onmessage = (event) => {
//       onMessage(event.data);
//     };
  
//     ws.onclose = () => {
//       console.log('WebSocket切断');
//       onClose && onClose();
//     };
  
//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
  
//     return ws;
//   }