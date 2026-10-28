import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

// --- ÍCONES SVG EMBUTIDOS ---
const IconEdit3 = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20h9"/><path d="16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const IconPlusCircle = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
  </svg>
);

const IconSearch = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const IconBookOpen = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const IconTag = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2H2v10l11.29 11.29a1 1 0 0 0 1.41 0l7.58-7.58a1 1 0 0 0 0-1.41L12 2z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const IconCalendar = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);

const IconUser = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconLogOut = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

const IconX = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

const IconAlertCircle = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
);

const IconSparkles = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
  </svg>
);

const IconLock = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconFileText = ({ size = 32, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>
  </svg>
);

const IconChevronRight = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const IconGraduationCap = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
  </svg>
);

const IconTrash2 = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const IconDownload = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const IconMaximize = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
  </svg>
);

// --- CONFIGURAÇÃO E INICIALIZAÇÃO DO FIREBASE ---
const firebaseConfig = typeof __firebase_config !== 'undefined' && __firebase_config
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "demo-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:123456"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' && __app_id ? __app_id : 'mural-turma-escola';

// Chaves de Armazenamento Local
const SESSION_STORAGE_KEY = 'mural_user_session_v3';
const LOCAL_TASKS_KEY = 'mural_tasks_backup_v3';
const LOCAL_USERS_KEY = 'mural_users_backup_v3';

// Lista das 17 matérias
const MATERIAS = [
  "Arte",
  "Educação Física",
  "Língua Inglesa",
  "Língua Portuguesa",
  "Matemática",
  "Biologia",
  "Física",
  "Química",
  "Filosofia",
  "Geografia",
  "História",
  "Sociologia",
  "Educação Sociocientifica e tecnologias sociais",
  "Artes, Cultura popular e população do campo",
  "Cooperativismo, economia solidária e economia feminista",
  "Agroecologia, manejo de agroecossistemas e soberania alimentar",
  "Historia da Bahia e Historia e Cultura camponesa, indígena, africana e afro-brasileira"
];

const TAGS = [
  { name: "Trabalho em Grupo", color: "bg-purple-900/60 text-purple-300 border-purple-500/40" },
  { name: "Prova / Avaliação", color: "bg-red-900/60 text-red-300 border-red-500/40" },
  { name: "Anotação de Aula", color: "bg-blue-900/60 text-blue-300 border-blue-500/40" },
  { name: "Lição de Casa", color: "bg-amber-900/60 text-amber-300 border-amber-500/40" },
  { name: "Projeto", color: "bg-emerald-900/60 text-emerald-300 border-emerald-500/40" }
];

// Hash simples para senhas
const hashPassword = (pwd) => {
  let hash = 0;
  for (let i = 0; i < pwd.length; i++) {
    const char = pwd.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
};

// Redimensionamento e compressão de imagens
const compressImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.65) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Contexto do canvas indisponível"));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function App() {
  // Estado do Usuário Autenticado
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Estados dos Formulários de Autenticação
  const [authMode, setAuthMode] = useState('login');
  const [authFormData, setAuthFormData] = useState({
    nome: '',
    usuario: '',
    senha: ''
  });
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Estados de Busca e Filtro
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMateriaFilter, setSelectedMateriaFilter] = useState('Todas');
  const [selectedTagFilter, setSelectedTagFilter] = useState('Todas');

  // Estados dos Modais
  const [selectedTask, setSelectedTask] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados do Formulário de Nova Atividade
  const [formData, setFormData] = useState({
    titulo: '',
    materia: MATERIAS[0],
    dataEntrega: '',
    tag: TAGS[0].name,
    descricao: '',
    imageUrl: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados de Dados da Aplicação com Inicialização Segura por LocalStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem(LOCAL_TASKS_KEY);
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem(LOCAL_USERS_KEY);
      return savedUsers ? JSON.parse(savedUsers) : [];
    } catch {
      return [];
    }
  });

  // Inicialização do Firebase
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __firebase_custom_token !== 'undefined' && __firebase_custom_token) {
          const userCredential = await signInWithCustomToken(auth, __firebase_custom_token);
          setFirebaseUser(userCredential.user);
        } else {
          const userCredential = await signInAnonymously(auth);
          setFirebaseUser(userCredential.user);
        }
      } catch (error) {
        console.warn("Autenticação anônima do Firebase indisponível. Operando em modo offline.", error);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  // Escutar Usuários Cadastrados
  useEffect(() => {
    if (!firebaseUser) return;

    try {
      const usersCollection = collection(db, 'artifacts', appId, 'public', 'data', 'usuarios_mural');

      const unsubscribe = onSnapshot(
        usersCollection,
        (snapshot) => {
          const users = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          if (users.length > 0) {
            setRegisteredUsers(users);
            try {
              localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
            } catch (e) {
              console.warn(e);
            }
          }
        },
        (error) => {
          console.warn("Firebase: Leitura de usuários operando em modo local seguro.");
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("Erro ao ler coleção de usuários:", err);
    }
  }, [firebaseUser]);

  // Escutar Atividades do Mural em Tempo Real
  useEffect(() => {
    if (!firebaseUser) return;

    try {
      const tasksCollection = collection(db, 'artifacts', appId, 'public', 'data', 'atividades_turma');

      const unsubscribe = onSnapshot(
        tasksCollection,
        (snapshot) => {
          const loadedTasks = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }));

          if (loadedTasks.length > 0) {
            loadedTasks.sort((a, b) => {
              const dateA = a.dataEntrega ? new Date(a.dataEntrega).getTime() : 0;
              const dateB = b.dataEntrega ? new Date(b.dataEntrega).getTime() : 0;
              return dateA - dateB;
            });

            setTasks(loadedTasks);
            try {
              localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(loadedTasks));
            } catch (e) {
              console.warn(e);
            }
          }
        },
        (error) => {
          console.warn("Firebase: Leitura de atividades operando em modo local seguro.");
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("Erro ao ler atividades:", err);
    }
  }, [firebaseUser]);

  // Login na Conta
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    const usuarioClean = authFormData.usuario.trim().toLowerCase();
    const senha = authFormData.senha.trim();

    if (!usuarioClean || !senha) {
      setAuthError('Digite seu usuário e sua senha.');
      return;
    }

    const foundUser = registeredUsers.find(u => (u.usuario || '').toLowerCase() === usuarioClean);

    if (foundUser) {
      if (foundUser.passHash && foundUser.passHash !== hashPassword(senha)) {
        setAuthError('Senha incorreta! Verifique seus dados.');
        return;
      }
      const sessionUser = {
        uid: foundUser.id || 'usr_' + Date.now(),
        docId: foundUser.id || 'usr_' + Date.now(),
        nome: foundUser.nome || usuarioClean,
        usuario: usuarioClean
      };
      setCurrentUser(sessionUser);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
      setAuthFormData({ nome: '', usuario: '', senha: '' });
      return;
    }

    // Login local imediato caso o cadastro não tenha sido localizado
    const sessionUser = {
      uid: 'user_' + Date.now(),
      docId: 'user_' + Date.now(),
      nome: authFormData.usuario,
      usuario: usuarioClean
    };
    setCurrentUser(sessionUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    setAuthFormData({ nome: '', usuario: '', senha: '' });
  };

  // Cadastro de Novo Usuário
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');

    const nomeClean = authFormData.nome.trim();
    const usuarioClean = authFormData.usuario.trim().toLowerCase();
    const senha = authFormData.senha.trim();

    if (!nomeClean || !usuarioClean || !senha) {
      setAuthError('Preencha todos os campos para se cadastrar.');
      return;
    }

    if (senha.length < 4) {
      setAuthError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    const alreadyExists = registeredUsers.some(u => (u.usuario || '').toLowerCase() === usuarioClean);
    if (alreadyExists) {
      setAuthError('Este nome de usuário já está em uso. Escolha outro.');
      return;
    }

    setAuthSubmitting(true);
    try {
      const newUser = {
        nome: nomeClean,
        usuario: usuarioClean,
        passHash: hashPassword(senha),
        criadoEm: new Date().toISOString()
      };

      let newDocId = 'usr_' + Date.now();

      try {
        const usersCollection = collection(db, 'artifacts', appId, 'public', 'data', 'usuarios_mural');
        const docRef = await addDoc(usersCollection, newUser);
        if (docRef?.id) newDocId = docRef.id;
      } catch (firestoreErr) {
        console.warn("Usuário salvo localmente devido a restrições de rede.");
      }

      const createdUserObj = { id: newDocId, ...newUser };
      const updatedUsersList = [...registeredUsers, createdUserObj];
      setRegisteredUsers(updatedUsersList);
      try {
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updatedUsersList));
      } catch (e) {
        console.warn(e);
      }

      const sessionUser = {
        uid: newDocId,
        docId: newDocId,
        nome: nomeClean,
        usuario: usuarioClean
      };

      setCurrentUser(sessionUser);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
      setAuthFormData({ nome: '', usuario: '', senha: '' });
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      setAuthError("Erro ao criar conta. Tente novamente.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Deslogar
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  // Processar Seleção de Arquivo de Imagem
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSubmitError('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    setIsCompressing(true);
    setSubmitError('');
    try {
      const compressedBase64 = await compressImage(file, 1000, 1000, 0.65);
      setImagePreview(compressedBase64);
      setFormData(prev => ({ ...prev, imageUrl: compressedBase64 }));
    } catch (err) {
      console.error("Erro no processamento da imagem:", err);
      setSubmitError("Não foi possível processar essa foto. Escolha outra imagem menor.");
    } finally {
      setIsCompressing(false);
    }
  };

  // Enviar Nova Tarefa
  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.titulo.trim() || !formData.dataEntrega) {
      setSubmitError("Preencha o título e a data de entrega.");
      return;
    }

    if (!formData.imageUrl) {
      setSubmitError("A foto / imagem é obrigatória para publicar a atividade.");
      return;
    }

    if (!currentUser) {
      setSubmitError("Você precisa estar logado para publicar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const tempId = 'task_' + Date.now();

      const dbPayload = {
        titulo: String(formData.titulo).trim(),
        materia: String(formData.materia || MATERIAS[0]),
        dataEntrega: String(formData.dataEntrega),
        tag: String(formData.tag || TAGS[0].name),
        descricao: String(formData.descricao || '').trim(),
        imageUrl: String(formData.imageUrl || ''),
        autorNome: String(currentUser.nome || 'Aluno(a)'),
        autorUsuario: String(currentUser.usuario || ''),
        autorUid: String(currentUser.uid || 'anonimo'),
        criadoEm: new Date().toISOString()
      };

      let savedId = tempId;

      try {
        const tasksCollection = collection(db, 'artifacts', appId, 'public', 'data', 'atividades_turma');
        const docRef = await addDoc(tasksCollection, dbPayload);
        if (docRef?.id) savedId = docRef.id;
      } catch (fsError) {
        console.warn("Gravando atividade localmente por conta de limite ou restrição do banco.");
      }

      const newFullTask = { id: savedId, ...dbPayload };

      setTasks(prev => {
        const updated = [newFullTask, ...prev].sort((a, b) => {
          const dateA = a.dataEntrega ? new Date(a.dataEntrega).getTime() : 0;
          const dateB = b.dataEntrega ? new Date(b.dataEntrega).getTime() : 0;
          return dateA - dateB;
        });

        try {
          localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(updated));
        } catch (err) {
          console.warn(err);
        }
        return updated;
      });

      setFormData({
        titulo: '',
        materia: MATERIAS[0],
        dataEntrega: '',
        tag: TAGS[0].name,
        descricao: '',
        imageUrl: '',
      });
      setImagePreview('');
      setSubmitError('');
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erro ao publicar:", err);
      setSubmitError("Erro ao salvar atividade. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verificação de Autoria da Postagem
  const isPostOwner = (task) => {
    if (!currentUser || !task) return false;

    const currentUsername = (currentUser.usuario || '').trim().toLowerCase();
    const taskUsername = (task.autorUsuario || '').trim().toLowerCase();

    if (currentUsername && taskUsername && currentUsername === taskUsername) {
      return true;
    }

    if (task.autorUid && (task.autorUid === currentUser.uid || task.autorUid === firebaseUser?.uid)) {
      return true;
    }

    if (!task.autorUsuario && !task.autorUid) {
      return true;
    }

    return false;
  };

  // Excluir Atividade
  const handleDeleteTask = async (task, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (!task) return;

    if (!window.confirm("Tem certeza que deseja apagar esta atividade?")) {
      return;
    }

    setTasks(prev => {
      const updated = prev.filter(t => t.id !== task.id);
      try {
        localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn(err);
      }
      return updated;
    });

    if (selectedTask?.id === task.id) {
      setSelectedTask(null);
    }

    try {
      const taskDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'atividades_turma', task.id);
      await deleteDoc(taskDocRef);
    } catch (err) {
      console.warn("Exclusão concluída localmente.");
    }
  };

  // Baixar a Imagem
  const handleDownloadImage = (url, filename = 'atividade.jpg') => {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  // Filtro de Atividades
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch = (task.titulo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (task.descricao || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (task.materia || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchMateria = selectedMateriaFilter === 'Todas' || task.materia === selectedMateriaFilter;
      const matchTag = selectedTagFilter === 'Todas' || task.tag === selectedTagFilter;

      return matchSearch && matchMateria && matchTag;
    });
  }, [tasks, searchQuery, selectedMateriaFilter, selectedTagFilter]);

  // Cálculo de Prazo de Entrega
  const getDeadlineStatus = (dataEntregaStr) => {
    if (!dataEntregaStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = dataEntregaStr.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Atrasado", color: "bg-red-950 text-red-400 border-red-800/60" };
    } else if (diffDays === 0) {
      return { text: "Entrega Hoje!", color: "bg-amber-950 text-amber-300 border-amber-700/60 animate-pulse" };
    } else if (diffDays === 1) {
      return { text: "Amanhã", color: "bg-yellow-950 text-yellow-300 border-yellow-700/60" };
    } else {
      return { text: `Faltam ${diffDays} dias`, color: "bg-emerald-950 text-emerald-400 border-emerald-800/60" };
    }
  };

  const getTagStyle = (tagName) => {
    const found = TAGS.find(t => t.name === tagName);
    return found ? found.color : "bg-slate-800 text-slate-300 border-slate-700";
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Carregando Mural da Turma...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, exibe Login / Cadastro
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 shadow-inner">
              <IconGraduationCap size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Mural da Turma</h1>
            <p className="text-slate-400 text-sm mt-1">Acesse sua conta para ver e enviar atividades</p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 bg-red-950/60 border border-red-800/50 rounded-xl text-red-300 text-xs sm:text-sm flex items-center gap-2.5">
              <IconAlertCircle size={18} className="shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Usuário</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <IconUser size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Seu usuário cadastrado"
                    value={authFormData.usuario}
                    onChange={(e) => setAuthFormData({ ...authFormData, usuario: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Senha</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <IconLock size={18} />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Sua senha"
                    value={authFormData.senha}
                    onChange={(e) => setAuthFormData({ ...authFormData, senha: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 font-semibold text-white rounded-xl shadow-lg shadow-indigo-600/25 transition duration-150 flex items-center justify-center gap-2 text-sm"
              >
                Entrar no Mural
                <IconChevronRight size={18} />
              </button>

              <div className="text-center mt-6 pt-6 border-t border-slate-800/80">
                <p className="text-xs text-slate-400">
                  Ainda não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setAuthError(''); }}
                    className="text-indigo-400 font-semibold hover:underline ml-1"
                  >
                    Criar Nova Conta
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Seu Nome e Sobrenome</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <IconUser size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João Silva"
                    value={authFormData.nome}
                    onChange={(e) => setAuthFormData({ ...authFormData, nome: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Escolha um Usuário</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <IconTag size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ex: joao_silva"
                    value={authFormData.usuario}
                    onChange={(e) => setAuthFormData({ ...authFormData, usuario: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Crie uma Senha</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <IconLock size={18} />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 4 caracteres"
                    value={authFormData.senha}
                    onChange={(e) => setAuthFormData({ ...authFormData, senha: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 font-semibold text-white rounded-xl shadow-lg shadow-emerald-600/25 transition duration-150 flex items-center justify-center gap-2 text-sm"
              >
                {authSubmitting ? 'Cadastrando...' : 'Criar minha Conta'}
                <IconSparkles size={16} />
              </button>

              <div className="text-center mt-6 pt-6 border-t border-slate-800/80">
                <p className="text-xs text-slate-400">
                  Já possui cadastro?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className="text-indigo-400 font-semibold hover:underline ml-1"
                  >
                    Fazer Login
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* CABEÇALHO */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <IconGraduationCap size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Mural da Turma
                  <span className="text-[10px] uppercase font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full">
                    Escola
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Trabalhos, datas de entrega e anotações</p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="sm:hidden p-2.5 bg-indigo-600 text-white rounded-xl active:bg-indigo-700 shadow-md flex items-center justify-center"
            >
              <IconPlusCircle size={20} />
            </button>
          </div>

          {/* PAINEL DO USUÁRIO LOGADO */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20 transition"
            >
              <IconPlusCircle size={18} />
              <span>Nova Atividade</span>
            </button>

            <div className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold text-xs flex items-center justify-center">
                {(currentUser.nome || 'A')[0].toUpperCase()}
              </div>
              <div className="text-left hidden xs:block">
                <p className="text-xs font-semibold text-white leading-tight">{currentUser.nome}</p>
                <p className="text-[10px] text-slate-400">@{currentUser.usuario}</p>
              </div>
              <button
                onClick={handleLogout}
                title="Sair da Conta"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition ml-1"
              >
                <IconLogOut size={16} />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">

        {/* FILTROS E PESQUISA */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Campo de Busca */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <IconSearch size={18} />
              </span>
              <input
                type="text"
                placeholder="Pesquisar por título, matéria ou conteúdo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Filtro por Matéria */}
            <div className="relative md:w-72">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <IconBookOpen size={18} />
              </span>
              <select
                value={selectedMateriaFilter}
                onChange={(e) => setSelectedMateriaFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer"
              >
                <option value="Todas">Todas as Matérias (17)</option>
                {MATERIAS.map((mat) => (
                  <option key={mat} value={mat}>{mat}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Tag */}
            <div className="relative md:w-56">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <IconTag size={18} />
              </span>
              <select
                value={selectedTagFilter}
                onChange={(e) => setSelectedTagFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer"
              >
                <option value="Todas">Todas as Tags</option>
                {TAGS.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* LISTA / CARDS DO MURAL */}
        {filteredTasks.length === 0 ? (
          <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center my-8">
            <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-4">
              <IconFileText size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-300">Nenhuma atividade encontrada</h3>
            <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">
              {searchQuery || selectedMateriaFilter !== 'Todas' || selectedTagFilter !== 'Todas'
                ? "Nenhuma tarefa corresponde aos filtros selecionados. Tente limpar a busca."
                : "Ainda não há tarefas publicadas no mural. Seja o primeiro a adicionar!"}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/20"
            >
              <IconPlusCircle size={18} />
              Publicar Atividade
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTasks.map((task) => {
              const status = getDeadlineStatus(task.dataEntrega);
              const tagStyle = getTagStyle(task.tag);
              const isOwner = isPostOwner(task);

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-200 cursor-pointer flex flex-col relative"
                >
                  {/* Imagem do Card */}
                  {task.imageUrl ? (
                    <div className="h-44 w-full bg-slate-950 relative overflow-hidden">
                      <img
                        src={task.imageUrl}
                        alt={task.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    </div>
                  ) : null}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      {/* Topo do Card */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/80 border border-indigo-800/40 px-2.5 py-1 rounded-md">
                          {task.materia}
                        </span>

                        {status && (
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${status.color}`}>
                            {status.text}
                          </span>
                        )}
                      </div>

                      {/* Título */}
                      <h2 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-2 leading-snug">
                        {task.titulo}
                      </h2>

                      {/* Descrição */}
                      {task.descricao && (
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                          {task.descricao}
                        </p>
                      )}
                    </div>

                    {/* Rodapé do Card */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <IconCalendar size={14} className="text-slate-500" />
                        <span>Entrega: <strong className="text-slate-200">{task.dataEntrega.split('-').reverse().join('/')}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${tagStyle}`}>
                          {task.tag}
                        </span>

                        {isOwner && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteTask(task, e)}
                            title="Apagar minha publicação"
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/60 rounded transition z-10"
                          >
                            <IconTrash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL DE ADICIONAR ATIVIDADE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden relative my-8 my-auto">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2">
                <IconEdit3 size={20} className="text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Publicar Atividade no Mural</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {submitError && (
                <div className="p-3 bg-red-950/80 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <IconAlertCircle size={16} className="shrink-0 text-red-400" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Título */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Título da Atividade / Trabalho *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Maquete de Geografia / Resumo Capítulo 4"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Matéria e Data de Entrega */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Matéria *</label>
                  <select
                    value={formData.materia}
                    onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
                  >
                    {MATERIAS.map((mat) => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Data de Entrega *</label>
                  <input
                    type="date"
                    required
                    value={formData.dataEntrega}
                    onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
                  />
                </div>
              </div>

              {/* Tag / Categoria */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Tipo / Categoria</label>
                <select
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
                >
                  {TAGS.map((t) => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Anexo de Imagem */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5 flex items-center gap-1">
                  Foto do Caderno / Anexo * <span className="text-red-400 font-normal text-[10px] uppercase">(Obrigatório)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required={!formData.imageUrl}
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-950 file:text-indigo-300 hover:file:bg-indigo-900 border border-slate-800 rounded-xl bg-slate-950 p-1.5 transition cursor-pointer"
                />
                {isCompressing && (
                  <p className="text-xs text-indigo-400 mt-1 animate-pulse">Otimizando foto...</p>
                )}
                {imagePreview && (
                  <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-800 max-h-40">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(''); setFormData({ ...formData, imageUrl: '' }); }}
                      className="absolute top-2 right-2 p-1 bg-slate-950/80 text-white rounded-full hover:bg-red-900 transition"
                    >
                      <IconX size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Informações Extras / Instruções</label>
                <textarea
                  rows={3}
                  placeholder="Escreva detalhes sobre o trabalho, tópicos cobrados, orientações do professor..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isCompressing}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                >
                  {isSubmitting ? 'Publicando...' : 'Publicar Atividade'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES DA ATIVIDADE */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative my-8 my-auto">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950 border border-indigo-800 px-2.5 py-1 rounded-md">
                  {selectedTask.materia}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded border ${getTagStyle(selectedTask.tag)}`}>
                  {selectedTask.tag}
                </span>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{selectedTask.titulo}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <IconCalendar size={14} className="text-indigo-400" />
                    Data de Entrega: <strong className="text-slate-200">{selectedTask.dataEntrega.split('-').reverse().join('/')}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconUser size={14} className="text-indigo-400" />
                    Publicado por: <strong className="text-slate-200">{selectedTask.autorNome}</strong>
                  </span>
                </div>
              </div>

              {selectedTask.imageUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 max-h-[500px] flex items-center justify-center group">
                  <img src={selectedTask.imageUrl} alt={selectedTask.titulo} className="w-full h-full object-contain" />
                  
                  <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
                    <button
                      type="button"
                      onClick={() => setFullscreenImage(selectedTask.imageUrl)}
                      className="p-2 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition flex items-center gap-1.5 text-xs font-medium"
                      title="Abrir em Tela Cheia"
                    >
                      <IconMaximize size={16} />
                      <span className="hidden sm:inline">Ver Zoom / Tela Cheia</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadImage(selectedTask.imageUrl, `${selectedTask.titulo}.jpg`)}
                      className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/50 rounded-lg transition flex items-center gap-1.5 text-xs font-semibold"
                      title="Baixar Foto"
                    >
                      <IconDownload size={16} />
                      <span className="hidden sm:inline">Baixar HD</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedTask.descricao && (
                <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-1">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Instruções & Detalhes</h4>
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{selectedTask.descricao}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
              {isPostOwner(selectedTask) ? (
                <button
                  type="button"
                  onClick={(e) => handleDeleteTask(selectedTask, e)}
                  className="px-3.5 py-2 bg-red-950/80 hover:bg-red-900 border border-red-800/60 text-red-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <IconTrash2 size={14} />
                  Apagar Publicação
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE IMAGEM EM TELA CHEIA */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-2 sm:p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="w-full flex items-center justify-end gap-3 p-2 z-10" onClick={(e) => e.stopPropagation()}>
            <a
              href={fullscreenImage}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <IconMaximize size={15} />
              Abrir em Nova Aba
            </a>
            <button
              type="button"
              onClick={() => handleDownloadImage(fullscreenImage, 'imagem-mural.jpg')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-lg"
            >
              <IconDownload size={16} />
              Baixar Imagem
            </button>
            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition"
            >
              <IconX size={20} />
            </button>
          </div>

          <div className="flex-1 w-full flex items-center justify-center overflow-auto p-2" onClick={(e) => e.stopPropagation()}>
            <img 
              src={fullscreenImage} 
              alt="Visualização em Tela Cheia" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-zoom-in"
            />
          </div>

          <p className="text-slate-500 text-xs text-center py-2">Clique em 'Abrir em Nova Aba' para zoom livre</p>
        </div>
      )}

    </div>
  );
}
