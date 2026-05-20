# Evidencia: GA7-220501096-AA3-EV01 - Codificación de Módulos del Software
**Proyecto:** Sport-App  
**Aprendiz:** Amelia Carolina García Taborda  
**Ficha de Caracterización:** 3118546  

## Sustentación Técnica del Cambio de Tecnología
Para mitigar bloqueos insuperables asociados a la sobrecarga (*overhead*) de dependencias y versiones en entornos basados en ORM Java (Hibernate/Maven) en arquitecturas locales, se optó por realizar la codificación del backend utilizando **Python** bajo el patrón estructural **DAO (Data Access Object)**.

Esta implementación garantiza el cumplimiento estricto de los requerimientos funcionales del software mediante el uso de transacciones ACID nativas con la librería `mysql-connector-python`, logrando una comunicación limpia de datos con el esquema de base de datos relacional original (`venta_ropa_deportiva`) desarrollado en MySQL Workbench.
