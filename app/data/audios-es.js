exports.GRABACION_AUDIO = '<speak>Sí, parece que se oye algo: ' +
  '<audio src="https://the-anomaly-897ce.firebaseapp.com/comunicacion-anomalia.mp3">' +
  'Para cerrar la brecha, debemos saturarla lumínicamente con los tres colores principales: rojo, azul y verde. Todo apuntando a la anomalía. Quizás el láser que estábamos usando en nuestro lado te puede servir, ya que emite luz azul. Aunque necesitarás algo más. Para encender el láser, utiliza el siguiente código de 6 dígitos: 2 1 1 0.' +
  '</audio> Los dígitos que ha dicho son 2 1 1 0. Pero luego parece que la grabación se corta abruptamente. ¿Qué hacemos?</speak>';

exports.LASER_ON_AUDIO = '<speak><par>' +
  '    <media end="10s">' +
  '      <audio clipBegin="1s" src="https://actions.google.com/sounds/v1/science_fiction/alien_beam.ogg">' +
  '      </audio>' +
  '      </media>' +
  '    <media><speak>¡Bien! El láser se enciende y un potente rayo azul atraviesa la estancia e impacta en la anomalía. Así se mantiene por ahora. ¿Qué hacemos?' +
  '  </speak>' +
  '  </media>' +
  '  </par></speak>';

exports.OPEN_BOX_AUDIO = '<speak><audio src="https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg"></audio> ¡Bien! La caja se abre, mostrando una llave. Me la llevo.</speak>';

exports.ENDING_AUDIO = '<speak><par><media repeatCount="3" soundLevel="-20dB">' +
  '<audio src="https://actions.google.com/sounds/v1/weapons/big_explosion_cut_off.ogg"></audio>' +
  '</media>' +
  '<media begin="15s">' +
  '<audio src="https://actions.google.com/sounds/v1/weapons/big_explosion_distant.ogg"></audio>' +
  '</media>' +
  '<media>' +
  '<speak>' +
  'La luz roja de la linterna, la luz verde de la anomalía y la luz azul del láser se combinan generando una luz blanca que satura a la anomalía. Se ve cómo la luz blanca se va consumiendo, a medida que la anomalía se va cerrando. Al final se cierra. ¡Bien! Has conseguido liberar a la humanidad de una destrucción sin precedentes. ¡Enhorabuena! Cuando salgas de aquí, recuerda que Dron Johnson te ayudó. ¡Hasta la próxima! {remainingTime}' +
  '</speak>' +
  '</media>' +
  '</par></speak>';

exports.HELLO = '<speak>' +
  '<audio src="https://the-anomaly-897ce.firebaseapp.com/beep.mp3"></audio>' +
  '  <break time="1s"></break>' +
  '  ¡Hola! Soy Dron Johnson ' +
  '   <audio src="https://actions.google.com/sounds/v1/cartoon/drum_roll.ogg" soundLevel="-15dB" clipBegin="1s" clipEnd="3s"></audio>. Estoy en la mansión, mientras tú me das órdenes desde el exterior, ya que esta casa es demasiado peligrosa para humanos. Debemos destruir la puerta al infierno. He hecho un escáner de la casa, y ahora estamos en el recibidor. Tenemos la cocina, la sala de estar y el dormitorio, donde he localizado la puerta del inframundo. Tenemos 15 minutos para salvar a la humanidad destruyendo esa puerta.' +
  '  <emphasis level="strong">¡Vamos! Dame instrucciones.</emphasis>' +
  '  </speak>';
