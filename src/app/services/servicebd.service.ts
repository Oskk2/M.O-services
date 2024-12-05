import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cortina } from './model/cortina';
import { Usuario } from './model/usuario';
import { Postventa } from './model/postventa';
import { Roles } from './model/roles';
import { Venta } from './model/venta'; 
import { Detalle } from './model/detalle'; 
import { Estado } from './model/estado';
import { Resena } from './model/resena'; 
import { AlertController, Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServicebdService {

  //variable de conexion a la base de datos
  public database!: SQLiteObject;
  private loggedUserSubject = new BehaviorSubject<Usuario | null>(null);
  public loggedUser$ = this.loggedUserSubject.asObservable();
  private carrito: any[] = [];

  private stockActualizado = new BehaviorSubject<any>(null);
  public stockActualizado$ = this.stockActualizado.asObservable();

  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();
  

  //variables de creacion de tablas
  // Menos relaciones primero
  tablaEstados: string = "CREATE TABLE IF NOT EXISTS estados (id_estado INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL);";
  tablaRoles: string = "CREATE TABLE IF NOT EXISTS roles (id_rol INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL);";
  tablaCortinas: string = "CREATE TABLE IF NOT EXISTS cortinas (id_cortina INTEGER PRIMARY KEY AUTOINCREMENT, nombre_cortina VARCHAR(100) NOT NULL, descripcion TEXT NOT NULL, precio INTEGER NOT NULL, url_imagen VARCHAR(255), stock INTEGER, estado INTEGER, FOREIGN KEY (estado) REFERENCES estados(id_estado));";
  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS usuario (id_usuario INTEGER PRIMARY KEY AUTOINCREMENT, nombre_usuario VARCHAR(100) NOT NULL, apellido_usuario VARCHAR(100), correo VARCHAR(100) NOT NULL, contrasena VARCHAR(255) NOT NULL, estado INTEGER, id_rol INTEGER, razon_baneo TEXT, FOREIGN KEY (estado) REFERENCES estados(id_estado), FOREIGN KEY (id_rol) REFERENCES roles(id_rol));";
  tablaPostventa: string = "CREATE TABLE IF NOT EXISTS postventa (id_postventa INTEGER PRIMARY KEY AUTOINCREMENT, nombre_usuario VARCHAR(100) NOT NULL, apellido_usuario VARCHAR(100), correo VARCHAR(100) NOT NULL, telefono VARCHAR(100) NOT NULL, comuna VARCHAR(100), descripcion VARCHAR(100), id_usuario INTEGER, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario));";
  tablaVenta: string = `CREATE TABLE IF NOT EXISTS venta (id_venta INTEGER PRIMARY KEY AUTOINCREMENT,f_venta DATE NOT NULL,id_usuario INTEGER,total INTEGER NOT NULL,id_estado INTEGER,incluir_instalacion INTEGER DEFAULT 0,direccion TEXT,comuna TEXT,FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),FOREIGN KEY (id_estado) REFERENCES estados(id_estado));`;
  tablaDetalle: string = "CREATE TABLE IF NOT EXISTS detalle (id_detalle INTEGER PRIMARY KEY AUTOINCREMENT, id_venta INTEGER, id_cortina INTEGER, cantidad INTEGER NOT NULL, subtotal INTEGER NOT NULL, FOREIGN KEY (id_venta) REFERENCES venta(id_venta), FOREIGN KEY (id_cortina) REFERENCES cortinas(id_cortina));";
  tablaResena: string = "CREATE TABLE IF NOT EXISTS resena (id_resena INTEGER PRIMARY KEY AUTOINCREMENT, descripcion TEXT NOT NULL, puntos_calidad INTEGER NOT NULL, puntos_servicio INTEGER, f_resena DATE NOT NULL, id_cortina INTEGER, id_usuario INTEGER, modificado INTEGER DEFAULT 0, baneada INTEGER DEFAULT 0, razon_baneo TEXT, FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario), FOREIGN KEY (id_cortina) REFERENCES cortinas(id_cortina));";


  //repite el proceso para cada tabla

  //variables de insert por defecto en la base de datos
  // Inserciones por defecto
  registroEstados: string = "INSERT OR IGNORE INTO estados (id_estado, nombre) VALUES (1, 'Activo'), (2, 'Pendiente');";
  registroRoles: string = "INSERT OR IGNORE INTO roles (id_rol, nombre) VALUES (1, 'Administrador'), (2, 'Usuario');";
  registroCortinas: string = "INSERT OR IGNORE INTO cortinas (id_cortina, nombre_cortina, descripcion, precio, url_imagen, stock, estado) VALUES (1, 'Cortina Roller Normal', 'Diseño minimalista que ofrece control de luz con estilo y funcionalidad.', 60000, 'assets/img/cortina1.jpg', 50, 1), (2, 'Cortina Roller Duo', 'Cortina de doble tela que alterna entre luz suave y oscuridad.', 45000, 'assets/img/cortina2.jpg', 50, 1), (3, 'Cortina Roller Blackout', 'Bloquea completamente la luz para máxima privacidad y descanso.', 50000, 'assets/img/cortina3.jpg', 50, 1), (4, 'Cortina Roller Blackout Opaca', 'Reduce significativamente la luz sin bloquearla por completo.', 30000, 'assets/img/cortina4.jpg', 50, 1);";
  registroUsuario: string = "INSERT OR IGNORE INTO usuario (id_usuario, nombre_usuario, apellido_usuario, correo, contrasena, estado, id_rol) VALUES (1, 'Usuario', 'Administrador', 'admin@gmail.com', 'Admin123', 1, 1), (2, 'Juan', 'Perez', 'j.perez@gmail.com', 'Juan123', 2, 2), (3, 'Lucas', 'Olea', 'l.olea@gmail.com', 'Lucas123', 1, 2), (4, 'Maria', 'Sepulveda', 'm.sepulveda@gmail.com', 'Maria', 1, 2);";
  registroPostventa: string = "INSERT OR IGNORE INTO postventa (id_postventa, nombre_usuario, apellido_usuario, correo, telefono, comuna, descripcion, id_usuario) VALUES (1, 'Juan', 'Perez', 'j.perez@gmail.com', '938475623', 'Recoleta', 'Problema con mi cortina', 2), (2, 'Lucas', 'Olea', 'l.olea@gmail.com', '939883723', 'Cerro Navia', 'Soporte caido', 3), (3, 'Maria', 'Sepulveda', 'm.sepulveda@gmail.com', '938754480', 'Las Condes', 'Cortina rota y sucia', 4);";
  registroVenta: string = `INSERT OR IGNORE INTO venta (id_venta, f_venta, id_usuario, total, id_estado, incluir_instalacion, direccion, comuna) VALUES (1, '2024-05-10', 2, 240000, 2, 0, 'Calle Ficticia 123', 'Santiago'), (2, '2024-09-26', 3, 180000, 1, 0, 'Av. Ejemplo 456', 'Providencia'), (3, '2024-08-17', 4, 200000, 1, 0, 'Calle Real 789', 'Ñuñoa');`;
  registroDetalle: string = "INSERT OR IGNORE INTO detalle (id_detalle, id_venta, id_cortina, cantidad, subtotal) VALUES (1, 1, 1, 4, 240000), (2, 2, 3, 3, 150000), (3, 3, 2, 6, 270000);";
  registroResena: string = "INSERT OR IGNORE INTO resena (id_resena, descripcion, puntos_calidad, puntos_servicio, f_resena, id_cortina, modificado) VALUES (1, 'Buena calidad', 5, 4, '2024-05-10', 1, 0), (2, 'Servicio impecable', 3, 5, '2024-09-26', 3, 0), (3, 'Perfecta instalacion', 5, 5, '2024-08-17', 2, 0);";


  //repite el proceso para cada tabla

  // Variables para guardar los registros resultantes de un select
  listadoEstados = new BehaviorSubject<Estado[]>([]); 
  listadoRoles = new BehaviorSubject<Roles[]>([]); 
  listadoCortinas = new BehaviorSubject<Cortina[]>([]);
  listadoUsuarios = new BehaviorSubject<Usuario[]>([]); 
  listadoPostventa = new BehaviorSubject<Postventa[]>([]); 
  listadoVentas = new BehaviorSubject<Venta[]>([]);
  listadoDetalles = new BehaviorSubject<Detalle[]>([]); 
  listadoResenas = new BehaviorSubject<Resena[]>([]); 
  
  //repite el proceso para cada tabla

  //variable para manipular el estado de la base de datos
  private isDBReady : BehaviorSubject<boolean> = new BehaviorSubject(false);
  
  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController,private http: HttpClient, private toastController: ToastController, ) {
    this.platform.ready().then(() => {
      this.crearBD();
    });
   }

  //funciones de retorno de observables
fetchEstados(): Observable<Estado[]> {
  return this.listadoEstados.asObservable();
}

fetchRoles(): Observable<Roles[]> {
    return this.listadoRoles.asObservable();
}

fetchCortinas(): Observable<Cortina[]> {
    return this.listadoCortinas.asObservable();
}

fetchUsuarios(): Observable<Usuario[]> {
    return this.listadoUsuarios.asObservable();
}

fetchPostventa(): Observable<Postventa[]> {
  return this.listadoPostventa.asObservable();
}

fetchVentas(): Observable<Venta[]> {
    return this.listadoVentas.asObservable();
}

fetchDetalles(): Observable<Detalle[]> {
    return this.listadoDetalles.asObservable();
}

fetchResenas(): Observable<Resena[]> {
    return this.listadoResenas.asObservable();
}


  dbState(){
    return this.isDBReady.asObservable();
  }

  async presentAlert(titulo:string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

  crearBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'ProyectoM.Oservices.db',
        location: 'default',
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.crearTablas().then(() => {
          // Llama a las consultas solo después de que las tablas y registros estén listos
          this.consultarCortinas();
          this.consultarPostventa();
          this.consultarResenas();
          this.consultarUsuarios();
          this.isDBReady.next(true);
        });
      }).catch(e => {
        this.presentAlert("Creacion de BD", "Error creando la BD: " + JSON.stringify(e));
      });
    });
  }

  async crearTablas() {
    // Orden obligatorio de tablas que dependen y de las que no dependen
    try {
      // Mandar a ejecutar las tablas en el orden específico
      await this.database.executeSql(this.tablaEstados, []);
      await this.database.executeSql(this.tablaRoles, []);
      await this.database.executeSql(this.tablaUsuario, []); // Usuario depende de Roles
      await this.database.executeSql(this.tablaCortinas, []);
      await this.database.executeSql(this.tablaPostventa, []); // Postventa depende de Usuario
      await this.database.executeSql(this.tablaVenta, []); // Venta depende de Usuario y Estado
      await this.database.executeSql(this.tablaDetalle, []); // Detalle depende de Venta y Cortina
      await this.database.executeSql(this.tablaResena, []); // Reseña depende de Usuario y Cortina
  
      // Generamos los inserts en caso que existan
      await this.database.executeSql(this.registroEstados, []);
      await this.database.executeSql(this.registroRoles, []);
      await this.database.executeSql(this.registroUsuario, []);
      await this.database.executeSql(this.registroCortinas, []);
      await this.database.executeSql(this.registroPostventa, []);
      await this.database.executeSql(this.registroVenta, []);
      await this.database.executeSql(this.registroDetalle, []);
      await this.database.executeSql(this.registroResena, []);
  
    } catch (e) {
      this.presentAlert("Creación de tabla", "Error creando las tablas: " + JSON.stringify(e));
    }
  }

  //Seccion Productos

  private consultarCortinas() {
    const query = 'SELECT * FROM cortinas'; 
    this.database.executeSql(query, []).then(res => {
      let cortinas: Cortina[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        cortinas.push(res.rows.item(i));
      }
      this.listadoCortinas.next(cortinas); 
    });
  }


  insertarCortina(nombre_cortina: string, descripcion: string, precio: string, url_imagen: string, stock: string) {
    return this.database.executeSql('INSERT INTO cortinas (nombre_cortina, descripcion, precio, url_imagen, stock) VALUES (?, ?, ?, ?, ?)', 
    [nombre_cortina, descripcion, precio, url_imagen, stock]).then(res => {
      this.consultarCortinas();
    }).catch(e => {
      this.presentAlert("Insertar", "Error: " + JSON.stringify(e));
    });
  }
  
  modificarCortina(id: string, nombre_cortina: string, descripcion: string, precio: string, url_imagen: string, stock: string) {
    return this.database.executeSql('UPDATE cortinas SET nombre_cortina = ?, descripcion = ?, precio = ?, url_imagen = ?, stock = ? WHERE id_cortina = ?', 
    [nombre_cortina, descripcion, precio, url_imagen, stock, id]).then(res => {
      this.consultarCortinas();
    }).catch(e => {
      this.presentAlert("Modificar", "Error: " + JSON.stringify(e));
    });
  }

  async activateProduct(productId: number) {
    await this.database.executeSql(`UPDATE cortinas SET estado = 1 WHERE id_cortina = ?`, [productId]);
    this.consultarCortinas(); // Actualiza el listado después de activar
  }
  
  async deactivateProduct(productId: number) {
    await this.database.executeSql(`UPDATE cortinas SET estado = 2 WHERE id_cortina = ?`, [productId]);
    this.consultarCortinas(); // Actualiza el listado después de desactivar
  }


  //Seccion Historial de compras
  async registrarCompra(
    id_usuario: number,
    total: number,
    incluirInstalacion: boolean,
    direccion: string,
    comuna: string,
    esAdmin: boolean = false
  ): Promise<void> {
    const estadoPendiente = 2; 
    const incluirInst = incluirInstalacion ? 1 : 0;
    const fechaCompra = new Date().toISOString().split('T')[0]; 
  
    const idUsuarioFinal = esAdmin ? 0 : id_usuario;
  
    // Verificar conexión de base de datos
    if (!this.database) {
      console.error('La base de datos no está inicializada.');
      throw new Error('Error al registrar la compra: base de datos no inicializada');
    }
  
    console.log('Datos para insertar en la tabla venta:', {
      f_venta: fechaCompra,
      id_usuario: idUsuarioFinal,
      total,
      id_estado: estadoPendiente,
      incluir_instalacion: incluirInst,
      direccion,
      comuna
    });
  
    try {
      await this.database.executeSql(
        `INSERT INTO venta (f_venta, id_usuario, total, id_estado, incluir_instalacion, direccion, comuna)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fechaCompra, idUsuarioFinal, total, estadoPendiente, incluirInst, direccion, comuna]
      );
      console.log('Compra registrada exitosamente en la base de datos');
    } catch (error) {
      console.error('Error en registrarCompra:', error);
      throw new Error('Error al registrar la compra'); 
    }
  }
  

// Método para actualizar el estado de una compra
async actualizarEstadoCompra(id_venta: number, nuevoEstado: number): Promise<void> {
  await this.database.executeSql(
    `UPDATE venta SET id_estado = ? WHERE id_venta = ?`,
    [nuevoEstado, id_venta]
  );
}

// Método para obtener las compras de un usuario específico
async obtenerComprasUsuario(id_usuario: number): Promise<any[]> {
  const res = await this.database.executeSql(
    `SELECT * FROM venta WHERE id_usuario = ?`,
    [id_usuario]
  );
  let compras = [];
  for (let i = 0; i < res.rows.length; i++) {
    compras.push(res.rows.item(i));
  }
  return compras;
}

// Método para obtener todas las compras (para el administrador)
async obtenerTodasLasCompras(): Promise<any[]> {
  try {
    // Obtener todas las compras
    const resCompras = await this.database.executeSql(`
      SELECT id_venta, f_venta, total, id_estado, incluir_instalacion, direccion, comuna, id_usuario
      FROM venta
    `, []);

    let compras = [];
    
    // Para cada compra, obtener el usuario correspondiente
    for (let i = 0; i < resCompras.rows.length; i++) {
      const compra = resCompras.rows.item(i);
      const resUsuario = await this.database.executeSql(`
        SELECT nombre_usuario, correo 
        FROM usuario 
        WHERE id_usuario = ?
      `, [compra.id_usuario]);
      
      const usuario = resUsuario.rows.item(0);
      
      compras.push({
        ...compra,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo
      });
    }
    
    return compras;
  } catch (error) {
    console.error('Error al obtener todas las compras:', error);
    throw new Error('No se pudieron obtener todas las compras');
  }
}




  //Seccion Postventa

  consultarPostventa() {
    return this.database.executeSql('SELECT * FROM postventa', []).then(res => {
      // variable para almacenar el resultado de la consulta
      let items: Postventa[] = [];
      // verificar si tenemos registros en la consulta
      if (res.rows.length > 0) {
        // recorro el resultado
        for (var i = 0; i < res.rows.length; i++) {
          // agregar el registro a mi variable
          items.push({
            id_postventa: res.rows.item(i).id_postventa,
            nombre_usuario: res.rows.item(i).nombre_usuario,
            apellido_usuario: res.rows.item(i).apellido_usuario,
            correo: res.rows.item(i).correo,
            telefono: res.rows.item(i).telefono,
            comuna: res.rows.item(i).comuna,
            descripcion: res.rows.item(i).descripcion
          });
        }
      }
      this.listadoPostventa.next(items as any);
    });
  }

  insertarPostventa(nombre_usuario: string, apellido_usuario: string, correo: string, telefono: string, comuna: string, descripcion: string){
    return this.database.executeSql('INSERT INTO postventa (nombre_usuario,apellido_usuario,correo,telefono,comuna,descripcion) VALUES (?,?,?,?,?,?)',[nombre_usuario,apellido_usuario,correo,telefono,comuna,descripcion]).then(res=>{
      this.consultarPostventa();
    }).catch(e=>{
      this.presentAlert("Insertar", "Error: " + JSON.stringify(e));
    })
  }

  eliminarPostventa(id: string) {
    return this.database.executeSql('DELETE FROM postventa WHERE id_postventa = ?', [id]).then(res => {
      this.consultarPostventa();
    }).catch(e => {
      this.presentAlert("Eliminar", "Error: " + JSON.stringify(e));
    });
  }

  // Sección Reseñas

  consultarResenas() {
    const query = 'SELECT * FROM resena';
    this.database.executeSql(query, []).then(res => {
      let items: Resena[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        items.push({
          id_resena: res.rows.item(i).id_resena,
          descripcion: res.rows.item(i).descripcion,
          puntos_calidad: res.rows.item(i).puntos_calidad,
          puntos_servicio: res.rows.item(i).puntos_servicio || 0,
          f_resena: res.rows.item(i).f_resena,
          id_usuario: res.rows.item(i).id_usuario,
          modificado: res.rows.item(i).modificado || 0,
          baneada: res.rows.item(i).baneada || 0, // Nuevo campo baneada
          razon_baneo: res.rows.item(i).razon_baneo || null // Nuevo campo razon_baneo
        });
      }
      this.listadoResenas.next(items); // Emite el nuevo listado
    }).catch(e => {
      this.presentAlert("Error", "Error al consultar reseñas: " + JSON.stringify(e));
    });
  }
  

  insertarResenas(descripcion: string, puntos_calidad: string, puntos_servicio: string, f_resena: string, id_usuario: number) {
    return this.database.executeSql(
      'INSERT INTO resena (descripcion, puntos_calidad, puntos_servicio, f_resena, id_usuario, modificado, baneada, razon_baneo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [descripcion, puntos_calidad, puntos_servicio, f_resena, id_usuario, 0, 0, null]
    ).then(() => {
      this.consultarResenas(); // Refresca el listado tras insertar
    }).catch(e => {
      this.presentAlert("Insertar", "Error: " + JSON.stringify(e));
    });
  }
  

  async modificarResena(id_resena: number, descripcion: string, puntos_calidad: number, puntos_servicio: number, f_resena: string): Promise<void> {
    const query = 'UPDATE resena SET descripcion = ?, puntos_calidad = ?, puntos_servicio = ?, f_resena = ?, modificado = 1 WHERE id_resena = ? AND modificado = 0';
    const values = [descripcion, puntos_calidad, puntos_servicio, f_resena, id_resena];
    
    const res = await this.database.executeSql(query, values);
    if (res.rowsAffected === 0) {
      return;
    }
  
    this.consultarResenas(); 
  }
  

  eliminarResenas(id:string){
    return this.database.executeSql('DELETE FROM resena WHERE id_resena = ?',[id]).then(res=>{
      this.consultarResenas();
    }).catch(e=>{
      this.presentAlert("Eliminar", "Error: " + JSON.stringify(e));
    })
  }

  async banearResena(id_resena: number, razon: string): Promise<void> {
    const query = `UPDATE resena SET baneada = 1, razon_baneo = ? WHERE id_resena = ?`;
    const values = [razon, id_resena];
  
    return this.database.executeSql(query, values).then(() => {
      this.consultarResenas(); // Refresca el listado de reseñas tras el baneo
    }).catch(e => {
      this.presentAlert("Error", "No se pudo banear la reseña: " + JSON.stringify(e));
    });
  }

  //Seccion usuario

  private consultarUsuarios() {
    const query = 'SELECT * FROM usuario';
    this.database.executeSql(query, []).then(res => {
      let usuarios: Usuario[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        usuarios.push(res.rows.item(i));
      }
      this.listadoUsuarios.next(usuarios);
    });
  }

  insertarUsuarios(nombre_usuario:string, apellido_usuario:string, correo:string, contrasena:string, estado:string){
    return this.database.executeSql('INSERT INTO usuario (nombre_usuario, apellido_usuario, correo, contrasena, estado) VALUES (?,?,?,?,?)',[nombre_usuario, apellido_usuario, correo, contrasena, estado]).then(res=>{
      this.consultarUsuarios();
    }).catch(e=>{
      this.presentAlert("Insertar", "Error: " + JSON.stringify(e));
    })
  }

  // Métodos para modificar usuarios
  modificarUsuario(id_usuario: number, usuario: Partial<Usuario>) {
    const { nombre_usuario, apellido_usuario, correo, contrasena, estado, id_rol } = usuario;
    const query = `UPDATE usuario SET 
                    nombre_usuario = COALESCE(?, nombre_usuario), 
                    apellido_usuario = COALESCE(?, apellido_usuario), 
                    correo = COALESCE(?, correo), 
                    contrasena = COALESCE(?, contrasena), 
                    estado = COALESCE(?, estado), 
                    id_rol = COALESCE(?, id_rol) 
                   WHERE id_usuario = ?`;
    const values = [nombre_usuario, apellido_usuario, correo, contrasena, estado, id_rol, id_usuario];

    this.database.executeSql(query, values).then(() => {
      this.presentAlert('Usuario Modificado', 'El usuario ha sido modificado correctamente');
      this.consultarUsuarios(); // Recarga la lista de usuarios
    }).catch(error => {
      console.error('Error al modificar el usuario: ', error);
      this.presentAlert('Error', 'No se pudo modificar el usuario');
    });
  }

  // Método en ServicebdService para actualizar datos del usuario
  actualizarUsuario(datos: { nombre_usuario: string, apellido_usuario: string, correo: string }) {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null');
    if (!loggedUser) {
      throw new Error('No se encontró el usuario en sesión');
    }

    const { nombre_usuario, apellido_usuario, correo } = datos;
    const id_usuario = loggedUser.id_usuario;
    const query = `UPDATE usuario SET 
                    nombre_usuario = COALESCE(?, nombre_usuario), 
                    apellido_usuario = COALESCE(?, apellido_usuario), 
                    correo = COALESCE(?, correo) 
                  WHERE id_usuario = ?`;
    const values = [nombre_usuario, apellido_usuario, correo, id_usuario];

    return this.database.executeSql(query, values)
      .then(() => {
        this.presentAlert('Perfil Actualizado', 'Tu perfil ha sido actualizado correctamente');
      })
      .catch(error => {
        console.error('Error al actualizar el perfil: ', error);
        this.presentAlert('Error', 'No se pudo actualizar el perfil');
      });
  }

    // Método para banear usuario con razón
  async banearUsuario(id_usuario: number, razon: string): Promise<void> {
    const query = `UPDATE usuario SET estado = 2, razon_baneo = ? WHERE id_usuario = ?`;
    const values = [razon, id_usuario];

    return this.database.executeSql(query, values).then(() => {
      this.consultarUsuarios(); // Actualiza la lista de usuarios después de banear
    }).catch(e => {
      this.presentAlert("Error", "No se pudo banear al usuario: " + JSON.stringify(e));
    });
  }

  // Activar y desactivar usuarios
  async activarUsuario(userId: number) {
    await this.database.executeSql(`UPDATE usuario SET estado = 1 WHERE id_usuario = ?`, [userId]);
  }

  async desactivarUsuario(userId: number) {
    await this.database.executeSql(`UPDATE usuario SET estado = 2 WHERE id_usuario = ?`, [userId]);
  }

  async agregarUsuario(nombre_usuario: string, apellido_usuario: string, correo: string, contrasena: string) {
    try {
      const estadoActivo = 1; // 1 para activo
      await this.database.executeSql(
        'INSERT INTO usuario (nombre_usuario, apellido_usuario, correo, contrasena, estado) VALUES (?, ?, ?, ?, ?)', 
        [nombre_usuario, apellido_usuario, correo, contrasena, estadoActivo]
      );
      this.consultarUsuarios();
    } catch (error) {
      throw new Error('Error al registrar el usuario');
    }
}

async validarUsuario(correo: string, contrasena: string): Promise<{ usuario: Usuario | null; reseñasBaneadas: Resena[] }> {
  const res = await this.database.executeSql('SELECT * FROM usuario WHERE correo = ? AND contrasena = ?', [correo, contrasena]);

  if (res.rows.length > 0) {
    const usuario: Usuario = res.rows.item(0);

    if (usuario.estado === 1) { // 1 significa "Activo"
      this.loggedUserSubject.next(usuario);
      localStorage.setItem('loggedUser', JSON.stringify(usuario));
      localStorage.setItem('userEmail', usuario.correo); // Guarda el correo del usuario para futuras verificaciones

      // Verificar si el usuario tiene alguna reseña baneada
      const reseñasBaneadas = await this.verificarResenasBaneadas(usuario.correo);
      return { usuario, reseñasBaneadas };
    } else {
      const razonBaneo = usuario.razon_baneo || 'Contacta al soporte para más información.';
      throw new Error(`La cuenta está baneada. Razón: ${razonBaneo}`);
    }
  }

  throw new Error('Correo o contraseña incorrectos.');
}

// Función para verificar reseñas baneadas basándose en el correo del usuario
private async verificarResenasBaneadas(correo: string): Promise<Resena[]> {
  const res = await this.database.executeSql('SELECT * FROM resena WHERE baneada = 1 AND id_usuario = (SELECT id_usuario FROM usuario WHERE correo = ?)', [correo]);
  const reseñasBaneadas: Resena[] = [];

  for (let i = 0; i < res.rows.length; i++) {
    reseñasBaneadas.push(res.rows.item(i));
  }
  return reseñasBaneadas;
}



  
  logout() {
    this.loggedUserSubject.next(null); 
    localStorage.removeItem('loggedUser');
  }

  
  public setLoggedUser(usuario: Usuario) {
    this.loggedUserSubject.next(usuario);
  }

  async verificarCorreo(correo: string): Promise<Usuario | null> {
    try {
      const res = await this.database.executeSql('SELECT * FROM usuario WHERE correo = ?', [correo]);
      if (res.rows.length > 0) {
        return {
          id_usuario: res.rows.item(0).id_usuario,
          nombre_usuario: res.rows.item(0).nombre_usuario,
          apellido_usuario: res.rows.item(0).apellido_usuario,
          correo: res.rows.item(0).correo,
          contrasena: res.rows.item(0).contrasena,
          estado: res.rows.item(0).estado,
          id_rol: res.rows.item(0).id_rol
        };
      } else {
        return null;
      }
    } catch (e) {
      this.presentAlert("Error", "Error verificando el correo: " + JSON.stringify(e));
      return null;
    }
  }

  async actualizarContra(correo: string, nuevaContra: string): Promise<void> {
    const res = await this.database.executeSql('UPDATE usuario SET contrasena = ? WHERE correo = ?', [nuevaContra, correo]);
    if (res.rowsAffected === 0) {
      throw new Error('No se pudo actualizar la contraseña. Verifica el correo y vuelve a intentarlo.');
    }
  }
  

  async verificarContrasena(correo: string, contrasena: string): Promise<boolean> {
    const query = 'SELECT * FROM usuario WHERE correo = ? AND contrasena = ?';
    return this.database.executeSql(query, [correo, contrasena]).then(res => {
      if (res.rows.length > 0) {
        const usuario = res.rows.item(0);
        this.loggedUserSubject.next(usuario); // Guarda el usuario en sesión
        return true; // Contraseña correcta
      } else {
        return false; // Contraseña incorrecta
      }
    }).catch(error => {
      console.error('Error al verificar la contraseña: ', error);
      return false; 
    });
  }
  
  isUserAdmin(userId: string): boolean {
    return userId === 'admin'; 
  }

  //stock manipulacion

  agregarProductoAlCarrito(cortina: any, cantidad: number) {
    const productoExistente = this.carrito.find(item => item.id_cortina === cortina.id_cortina);
    
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
      this.mostrarToast('Cantidad actualizada en el carrito', 'success');
    } else {
      const producto = { ...cortina, cantidad };
      this.carrito.push(producto);
      this.cartItemCount.next(this.carrito.length);
      this.mostrarToast('Producto agregado al carrito', 'success');
    }
  
    const usuario = localStorage.getItem('loggedUser');
    if (usuario) {
      const usuarioId = JSON.parse(usuario).id_usuario;
      this.guardarCarritoUsuario(usuarioId); // Guardar carrito actualizado para el usuario logeado
    } else {
      this.guardarCarritoAnonimo(); // Guardar carrito para usuarios no logeados
    }
  }
  

cargarCarritoUsuario(id_usuario: number) {
  const carritoGuardado = localStorage.getItem(`carrito_${id_usuario}`);
  this.carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

guardarCarritoUsuario(id_usuario: number) {
  localStorage.setItem(`carrito_${id_usuario}`, JSON.stringify(this.carrito));
}


async confirmarCompra() {
  try {
      for (const item of this.carrito) {
          // Verificar si hay stock suficiente en la base de datos antes de reducirlo
          const res = await this.database.executeSql(
              'SELECT stock FROM cortinas WHERE id_cortina = ?',
              [item.id_cortina]
          );
          const stockActual = res.rows.item(0).stock;

          if (stockActual >= item.cantidad) {
              // Reducir el stock en la base de datos
              await this.database.executeSql(
                  'UPDATE cortinas SET stock = stock - ? WHERE id_cortina = ?',
                  [item.cantidad, item.id_cortina]
              );
          } else {
              this.presentAlert("Stock insuficiente", `No hay suficiente stock para la cortina: ${item.nombre_cortina}`);
              return; // Detener la compra si falta stock
          }
      }
      // Vaciar el carrito solo después de confirmar la compra
      this.vaciarCarrito();
      this.cartItemCount.next(0); 
      this.presentAlert("Compra confirmada", "La compra ha sido realizada exitosamente.");
  } catch (error) {
      this.presentAlert("Error", "Hubo un problema al confirmar la compra: " + JSON.stringify(error));
  }
}

async obtenerCortinaPorId(id_cortina: number): Promise<Cortina | null> {
  try {
    const query = 'SELECT * FROM cortinas WHERE id_cortina = ?';
    const result = await this.database.executeSql(query, [id_cortina]);

    if (result.rows.length > 0) {
      const cortina: Cortina = result.rows.item(0);
      return cortina;
    } else {
      return null; // Si no se encuentra la cortina
    }
  } catch (error) {
    this.presentAlert("Error", "No se pudo obtener la cortina: " + JSON.stringify(error));
    return null;
  }
}

async modificarStock(id_cortina: number, cantidad: number): Promise<void> {
  try {
    // Obtener el stock actual del producto
    const res = await this.database.executeSql('SELECT stock FROM cortinas WHERE id_cortina = ?', [id_cortina]);

    if (res.rows.length > 0) {
      const stockActual = res.rows.item(0).stock;
      const nuevoStock = Math.min(stockActual + cantidad, 50); // Limitar el stock a un máximo de 50

      console.log(`ID: ${id_cortina}, Stock actual: ${stockActual}, Cantidad: ${cantidad}, Nuevo stock: ${nuevoStock}`);

      // Validación para asegurarnos de que el stock no baje de cero ni supere 50
      if (nuevoStock < 0) {
        this.presentAlert("Error", "Stock insuficiente para realizar esta acción.");
        return;
      }

      // Actualizar el stock en la base de datos
      await this.database.executeSql('UPDATE cortinas SET stock = ? WHERE id_cortina = ?', [nuevoStock, id_cortina]);
    } else {
      this.presentAlert("Error", "Producto no encontrado.");
    }
  } catch (error) {
    this.presentAlert("Error", "No se pudo actualizar el stock: " + JSON.stringify(error));
  }
}

  obtenerCarrito(): any[] {
    return this.carrito;
  }

  eliminarProductoDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.cartItemCount.next(this.cartItemCount.value - 1);
    this.mostrarToast('Producto eliminado del carrito','danger');
  
    const usuario = localStorage.getItem('loggedUser');
    if (usuario) {
      const usuarioId = JSON.parse(usuario).id_usuario;
      this.guardarCarritoUsuario(usuarioId); // Guardar carrito actualizado
    } else {
      this.guardarCarritoAnonimo(); // Guardar carrito para usuarios no logeados
    }
  }
  

  vaciarCarrito() {
    this.carrito = [];
    this.cartItemCount.next(0);
    this.mostrarToast('Carrito vaciado', 'danger');
  
    const usuario = localStorage.getItem('loggedUser');
    if (usuario) {
      const usuarioId = JSON.parse(usuario).id_usuario;
      this.guardarCarritoUsuario(usuarioId); // Guardar carrito actualizado para el usuario logeado
    } else {
      this.guardarCarritoAnonimo(); // Guardar carrito para usuarios no logeados
    }
  }
  

  guardarCarritoAnonimo() {
    localStorage.setItem('carritoAnonimo', JSON.stringify(this.carrito));
    console.log("Carrito vacío guardado para usuario no logeado");
  }


    // Método para descontar el stock y emitir cambios
  async descontarStock(id_cortina: number, cantidad: number) {
    await this.modificarStock(id_cortina, -cantidad); // Descuenta el stock
    const productoActualizado = await this.obtenerCortinaPorId(id_cortina);
    if (productoActualizado) {
      this.stockActualizado.next(productoActualizado); // Emite el cambio de stock

      // Si el stock llega a 0, muestra el toast en ProductosPage
      if (productoActualizado.stock === 0) {
        this.mostrarToast(`La cortina ${productoActualizado.nombre_cortina} ya no está disponible.`, 'danger');
      }
    }
  }
  
  vaciarCarritoTemporal() {
    this.carrito = []; 
    this.cartItemCount.next(0);
  }

  //Toast opcional
  private async mostrarToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    toast.present();
  }

}
