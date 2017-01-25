# Vue-Dynamic-Table 

Componente para manejar tablas.

##Instalación

Debes de importar el archivo del componente despues de importar vuejs

```
<script src="vue-dynamic-table.js"></script>

```

Tenemos que agregar el codigo del componente dentro de nuestro componente vue

```
<vue-dynamic-table
    v-bind:columns="myColumns"
    v-bind:data-model="myDataModel">
</vue-dynamic-table>

```

Para que el componente funcione tiene que tener como minimo la opcion de columns y la opcion de data-model.
Las cuales son arreglos de objetos.


```
var TestComponent = new Vue({
	el: '#test-component',
	data: {
    	myColumns: [
        	{ name:'col1', title:'Column 1', visible: true },
        	{ name:'col2', title:'Column 2', visible: true },
        	{ name:'col3', title:'Column 3', visible: true },
        	{ name:'col4', title:'Column 4', visible: true }
        ],
        myDataModel: [
        	{ col1: 'Value 1, 1', col2: 'Value 1, 2', col3: 'Value 1, 3', col4: 'Value 1, 4' },
        	{ col1: 'Value 2, 1', col2: 'Value 2, 2', col3: 'Value 2, 3', col4: 'Value 2, 4' },
        	{ col1: 'Value 3, 1', col2: 'Value 3, 2', col3: 'Value 3, 3', col4: 'Value 3, 4' },
        	{ col1: 'Value 4, 1', col2: 'Value 4, 2', col3: 'Value 4, 3', col4: 'Value 4, 4' }
        ]
    }
});
```

Cada objeto del array que se le pasa a a la tabla por la propiedad columns, representa una columna de la tabla.
Cada objeto del array que se le pasa a a la tabla por la propiedad data-model, representa una fila de la tabla.

####Objeto Columna

El objeto columna como minimo necesita dos propiedades para funcionar. Que son el name, title y visible.
```
{ name: 'foo', title: 'Title of Colomn Foo', visible: true }
```
La propiedad name hace referencia a la propiedad a imprimir de un objeto del array data-model.
La propiedad title indica cual sera el titulo de la columna en la tabla.
La propiedad visible indica si la columna es visible

####Objeto Modelo

El objeto columna solo tiene que tener las propiedades a mostrar. La unica restriccion es que todas las propiedades motrar datos.

##Propiedades

Hay distintas propiedades que nos permiten hacer distintas cosas en la tabla y tambien para manejar eventos. A continuacion mencionaremos las propiedades de la tabla, como distintos eventos.

###Propiedades de tabla

######ClassName (class-name)
La propiedad class-name de la tabla nos permite cambiar la propiedad class de la tabla para distintos usos. Puede ser desde aplicarle un plugin de jquery o cambiar el stilo. En el ejemplo de uso de la tabla utilizamos la propiedad para aplicarle estilo de tabla de bootstrap.

```
<vue-dynamic-table
	class-name="table table-bordered table-hover"
    v-bind:columns="myColumns"
    v-bind:data-model="myDataModel">
</vue-dynamic-table>
```

######PaginationOptions (pagination-options)
La propiedad pagination-options de la tabla nos permite mostrar un paginador el cual sera personalizado de acuerdo a los valores de las propiedades del objeto asignado a esta.

```
<vue-dynamic-table
	class-name="table table-bordered table-hover"
    v-bind:columns="myColumns"
    v-bind:data-model="myDataModel"
    v-bind:pagination-options="myPaginationOptions">
</vue-dynamic-table>
```

```
var TestComponent = new Vue({
	el: '#test-component',
	data: {
    	myColumns: [
        	{ name:'col1', title:'Column 1', visible: true },
        	{ name:'col2', title:'Column 2', visible: true },
        	{ name:'col3', title:'Column 3', visible: true },
        	{ name:'col4', title:'Column 4', visible: true }
        ],
        myDataModel: [
        	{ col1: 'Value 1, 1', col2: 'Value 1, 2', col3: 'Value 1, 3', col4: 'Value 1, 4' },
        	{ col1: 'Value 2, 1', col2: 'Value 2, 2', col3: 'Value 2, 3', col4: 'Value 2, 4' },
        	{ col1: 'Value 3, 1', col2: 'Value 3, 2', col3: 'Value 3, 3', col4: 'Value 3, 4' },
        	{ col1: 'Value 4, 1', col2: 'Value 4, 2', col3: 'Value 4, 3', col4: 'Value 4, 4' }
        ],
        myPaginationOptions: {
        	position: 'top',
            sizeOptionClass: 'form-control',
            sizeOptions: [10, 20, 30, 40, 50],
            size: 10,
            paginatorClass: 'list-inline',
            pageOptionClass: 'btn btn-primary',
            page: 1
        }
    }
});
```
|Propiedad|Descripcion|Valores|
|:---|:---|:---|
|**position**|Posiciona el paginador|String(top, bottom)|
|**sizeOptionClass**|Clase que tendra el elemento select donde estan las opciones de tamaño de pagina|String|
|**sizeOptions**|Array en donde se definen las opciones de tamaño de pagina|Array(Number*)|
|**size**|Tamaño actual de la pagina. Este dato siempre sera el tamaño actual de la pagina, si se cambia el tamaño esta propiedad cambia|Number|
|**paginatorClass**|Clase que se le aplicara a la lista de opciones del paginador|String|
|**pageOptionClass**|Clase que se le aplicacara a un elemento de la lista de opciones del paginador|String|
|**page**|Pagina actual. Este dato siempre sera la pagina actual.|Number|

###Tipos de Columnas

######Normal

Una columna normal necesita solo las siguientes propiedades para poder mostrar informacion. Este tipo de columnas solo muestran el texto de forma normal.

|Propiedad|Descripcion|Valores|
|:---|:---|:---|
|**name**|Es el nombre la propiedad del objeto fila que se mostrara|String|
|**title**|Es el titulo a mostrar de la columna|String|
|**visible**|Indica si la columna sra visible|Boolean, Default(false)|
|**sorteable**|Indica si la columna puede ordenarse al dar click al titulo de la columna|Boolean|


######Personalizada

Esta columna se puede utilizar para imprimir informacion de forma personalizada. Por ejemplo si tenemos informacion sobre una url de una imagen, con esta columna podemos imprimir la imagen.

|Propiedad|Descripcion|Valores|
|:---|:---|:---|
|**title**|Es el titulo a mostrar de la columna|String|
|**visible**|Indica si la columna sra visible|Boolean, Default(false)|
|**customRender**|Funcion que debe retonar el contido a mostrar en la celda|Function(row) -> String|

######Input

Esta columna muestra la informacion dentro de un input del tipo texto. El contenido del input esta enlazado con el objeto modelo por lo cual momento de editar el input estas editanto en el modelo.

|Propiedad|Descripcion|Valores|
|:---|:---|:---|
|**name**|Es el nombre la propiedad del objeto fila que se mostrara|String|
|**title**|Es el titulo a mostrar de la columna|String|
|**visible**|Indica si la columna sra visible|Boolean, Default(false)|
|**sorteable**|Indica si la columna puede ordenarse al dar click al titulo de la columna|Boolean|
|**input**|Objeto que contiene las propiedades del input|Object|

Propiedades del objeto input.

|Propiedad|Descripcion|Valores|
|:---|:---|:---|
|**inputClass**|Es la clase que se le asigna al objeto input|String|
|**placeHolder**|Es el texto que se muestra cuando el campo esta vacio|String|

