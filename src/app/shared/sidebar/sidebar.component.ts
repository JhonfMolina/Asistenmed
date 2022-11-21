import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuPrincipal= [
    {
      title: 'Parametros / Configuración',
      marker: 'parametros',
      menuItems : [
        { path: '/admin/parametros/vias-ingreso', title: 'Vias de Ingreso',  icon:'meeting_room' },
        { path: '/admin/parametros/tipos-consultas', title: 'Tipos de Consultas',  icon:'drive_file_rename_outline' },
        { path: '/admin/parametros/pacientes', title: 'Pacientes',  icon:'sick' },
        { path: '/admin/parametros/medicos', title: 'Medicos',  icon: 'medication' },
        { path: '/admin/parametros/categorias-diagnosticos', title: 'Categorias Diagnosticos',  icon:'category' },
        { path: '/admin/parametros/diagnosticos', title: 'Diagnosticos',  icon:'content_paste' },
        { path: '/admin/parametros/convenios-administrativos', title: 'Convenios / EPS',  icon:'handshake' },
        { path: '/admin/parametros/regimenes', title: 'Regimenes',  icon:'bubble_chart' },
        { path: '/admin/parametros/farmacias', title: 'Farmacias',  icon:'medical_services' },
        { path: '/admin/parametros/laboratorios', title: 'Laboratorios',  icon:'science' },
        { path: '/admin/parametros/centros-imagenes', title: 'Centro Imagenes',  icon:'filter' },
        { path: '/admin/parametros/medicamentos', title: 'Medicamentos',  icon:'medication_liquid' },
        { path: '/admin/parametros/examenes', title: 'Examenes',  icon:'quiz' },
        { path: '/admin/parametros/imagenologias', title: 'Ayudas Diagnosticas',  icon:'broken_image' },
        { path: '/admin/parametros/parametros-historia', title: 'Parametros de Historia',  icon:'history_edu' },
        // { path: '/admin/parametros/tipo-citas', title: 'Tipos de citas',  icon:'diversity_2' },
        // { path: '/admin/parametros/gestion-horario-medico', title: 'Gestión Horarios Medicos',  icon:'hourglass_top' },
        
      ]  
    },
    {
      title: 'Control de Citas',
      marker: 'control',
      menuItems : [
        // { path: '/admin/movimientos/agenda-medica', title: 'Agenda Medica',  icon: 'view_agenda' },
        // { path: '/admin/movimientos/citas', title: 'Citas Medicas',  icon: 'groups_2' },
        { path: '/admin/movimientos/historia-clinica', title: 'Historia Clinica',  icon: 'history_edu' },
        { path: '/admin/movimientos/evolucion-medica', title: 'Evolución Medica',  icon: 'contact_page' },
        { path: '/admin/movimientos/orden-medica', title: 'Orden Medica',  icon: 'grading' },
      ]  
    },
    {
      title: 'Consultas y Reportes',
      marker: 'consultas',
      menuItems : [
        { path: '/admin/consultas/consultar-historia', title: 'Consultar Historia Clinica',  icon: 'history_edu' },
      ]  
    }

  ]


  constructor() { }

  ngOnInit(): void {
    
  }

  

}
