/**
 * Crea una presentación de Google Slides basada en la estructura
 * sugerida para la tesis del sistema de gestión de servicio técnico.
 * Ejecuta createPresentation() en el editor de Apps Script vinculado a Google Drive.
 */
function createPresentation() {
  const presentationTitle = 'Gestión integral de servicio técnico';
  const slides = [
    {
      title: 'Portada',
      subtitle: 'Plataforma integral para gestión de servicios técnicos',
      bullets: [
        'Autor: <Nombre del autor>',
        'Tutor: <Nombre del tutor>',
        'Fecha: <Mes y año>'
      ],
      notes: 'Presenta el título oficial del trabajo y un lema breve.'
    },
    {
      title: 'Problema y objetivos',
      bullets: [
        'Necesidad de centralizar clientes, oficinas, dispositivos y servicios.',
        'Objetivos: autenticación con roles, panel unificado, control de operaciones.'
      ],
      notes: 'Explica el contexto que motivó el desarrollo y los objetivos alcanzables.'
    },
    {
      title: 'Arquitectura general',
      bullets: [
        'API REST Node.js/Express conectada a base MySQL.',
        'Cliente web React con Vite.',
        'Comunicación segura mediante endpoints protegidos.'
      ],
      notes: 'Agrega un diagrama de dos capas si dispones de material visual.'
    },
    {
      title: 'Módulos backend',
      bullets: [
        'controllers/: lógica de negocio para clientes, oficinas, dispositivos, servicios y usuarios.',
        'routes/: vincula endpoints con middlewares de rol.',
        'middlewares/authMiddleware.js: verificación JWT y control de permisos.'
      ],
      notes: 'Sugiere un diagrama de secuencia Solicitud → Middleware → Controlador → BD.'
    },
    {
      title: 'Autenticación y seguridad',
      bullets: [
        'Flujo de login en authController.login con bcrypt.',
        'Emisión de JWT con expiración de 4 horas.',
        'Rutas protegidas por tokens y roles específicos.'
      ],
      notes: 'Resalta cómo se protege el acceso y la expiración de tokens.'
    },
    {
      title: 'Gestión de clientes (CRUD)',
      bullets: [
        'Operaciones parametrizadas de listar, crear, modificar y eliminar.',
        'Respuestas del frontend ClientesPanel.tsx con axios y modales.',
        'Validación de permisos con can("clientes_crud").'
      ],
      notes: 'Incorpora capturas del panel para ilustrar el flujo.'
    },
    {
      title: 'Frontend: estructura y navegación',
      bullets: [
        'App.tsx define rutas públicas y privadas.',
        'AuthContext gestiona token, roles (admin, técnico, cliente) y permisos.',
        'Panel.tsx actúa como hub y habilita módulos según permisos.'
      ],
      notes: 'Puedes destacar el uso de React Context y componentes reutilizables.'
    },
    {
      title: 'Flujo de usuario',
      bullets: [
        'Inicio de sesión en /auth/login y almacenamiento del JWT.',
        'Panel muestra opciones según permisos asignados.',
        'Cada panel consulta su endpoint protegido.'
      ],
      notes: 'Incluye un diagrama de flujo o animación sencilla si es posible.'
    },
    {
      title: 'Seguridad y control de acceso',
      bullets: [
        'Token Bearer en el encabezado Authorization.',
        'Middleware de roles filtra acciones por entidad.',
        'Sincronización de sesión en AuthContext y expiración configurable.'
      ],
      notes: 'Recalca el almacenamiento local y la revocación automática tras 4 horas.'
    },
    {
      title: 'Resultados y estado actual',
      bullets: [
        'CRUD completos para entidades principales.',
        'Panel responsive con diseño consistente.',
        'Autenticación robusta y control de permisos operativo.'
      ],
      notes: 'Añade métricas o capturas si se dispone de ellas.'
    },
    {
      title: 'Trabajo futuro',
      bullets: [
        'Pruebas automatizadas y cobertura de QA.',
        'Despliegue en producción y monitoreo.',
        'Informes gráficos y auditoría de acciones.'
      ],
      notes: 'Abre la discusión sobre evolución del proyecto.'
    },
    {
      title: 'Cierre y preguntas',
      bullets: [
        'Recapitulación del aporte del sistema.',
        'Agradecimientos y espacio para dudas.'
      ],
      notes: 'Prepara respuestas frecuentes sobre roles, rutas y decisiones técnicas.'
    }
  ];

  const presentation = SlidesApp.create(presentationTitle);
  const slidesCollection = presentation.getSlides();

  // Configura la primera diapositiva con el título y subtítulo.
  const titleSlide = slidesCollection[0];
  titleSlide.getPageElements().forEach(element => element.remove());
  titleSlide.insertTextBox(slides[0].title, 50, 80, 400, 60)
    .getText().getTextStyle().setFontSize(36).setBold(true);
  titleSlide.insertTextBox(slides[0].subtitle, 50, 160, 400, 40)
    .getText().getTextStyle().setFontSize(18);
  titleSlide.insertTextBox(slides[0].bullets.join('\n'), 50, 220, 400, 120)
    .getText().getTextStyle().setFontSize(14);
  titleSlide.getNotesPage().getSpeakerNotesShape().getText().setText(slides[0].notes);

  // Crea el resto de las diapositivas.
  for (let i = 1; i < slides.length; i++) {
    const slideData = slides[i];
    const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
    const shapes = slide.getShapes();
    const titleShape = shapes[0];
    const bodyShape = shapes[1];

    titleShape.getText().setText(slideData.title);
    const bodyText = bodyShape.getText();
    bodyText.setText(slideData.bullets.join('\n'));

    const paragraphs = bodyText.getParagraphs();
    paragraphs.forEach(paragraph => paragraph.getParagraphStyle().setParagraphSpacingAbove(6));
    bodyShape.getText().getListStyle().applyListPreset(SlidesApp.ListPreset.BULLET_DISC_CIRCLE_SQUARE);

    slide.getNotesPage().getSpeakerNotesShape().getText().setText(slideData.notes);
  }

  SlidesApp.flush();
  Logger.log('Presentación creada: %s', presentation.getUrl());
}
