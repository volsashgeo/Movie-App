import React from 'react';
import ReactDOM from 'react-dom/client';
import { Offline, Online } from 'react-detect-offline';
import { Alert } from 'antd';

import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Online>
      <App />
    </Online>
    <Offline>
      <Alert
        message="Возникла ошибка, попробуйте перезагрузить страницу"
        description="Восстановите подключение к сети"
        type="error"
        closable
        showIcon="true"
        className="alert-fontsize"
      />
    </Offline>
  </React.StrictMode>
);
