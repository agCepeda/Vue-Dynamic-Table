Vue.component('vue-dynamic-table', {
	props: {
		columns: Array,
		className: String,
		dataModel: Array,
		sortIndicatorAsc: String,
		sortIndicatorDesc: String,
		pagination: Boolean,
		paginationOptions: Object,
		filterEnabled: Boolean,
		actionLinkClick: Function,
		actionButtonClick: Function
	},
	data: function() {
		return {
			sortColumn: null,
			sortOrder: 'ASC'
		}
	},
	methods: {
		drag: function(column, event) {
			var elemWidth  = event.target.offsetWidth;
			if (event.offsetX >= elemWidth - 3 && event.offsetX <= elemWidth + 3) {
				event.target.id = 'ASDASDADFASDAsd';
				event.dataTransfer.setData('type', 'resize');
				event.dataTransfer.setData('target', event.target.id);
			} else {
				event.dataTransfer.setData('type', 'move');
				event.dataTransfer.setData('column', this.columns.indexOf(column));	
			}
		},
		allowDrop: function(column, event) {
			event.preventDefault();
			var type = event.dataTransfer.getData('type');
			
			if (type == 'resize') {
				var target = event.dataTransfer.getData('target');
				//document.getElementById(target).style.width += '1px';
			} else if (type == 'move') {
				var indexColumn = this.columns.indexOf(column);
				console.log('show indicator column', indexColumn);
			}
		},
		drop: function(column, event) {
			event.preventDefault();
			var type = event.dataTransfer.getData('type');
			
			if (type == 'resize') {
				console.log(event);
				console.log(event.target);

				var target = event.dataTransfer.getData('target');
				var element = document.getElementById(target);
				element.offsetWidth += 500;
				element.id  = '';
				console.log(element.offsetWidth);
			} else if (type == 'move') {
				var indexOrigin = event.dataTransfer.getData('column');
				var indexTarget = this.columns.indexOf(column);

				var aux = this.columns[indexOrigin];
				
				this.columns.splice(indexOrigin, 1);
				this.columns.splice(indexTarget, 0, aux);
			}
		},
        linkEvent: function(index, row, column) {
			this.$emit('action-link-click', index, row, column);
        },
        buttonEvent: function(index, row, column) {
			this.$emit('action-button-click', index, row, column);
        },
		sort: function(column) {
			if (!column.sortable)
				return;
			if (this.sortColumn == column.name) {
				if (this.sortOrder == 'ASC')
					this.sortOrder = 'DESC'
				else
					this.sortOrder = 'ASC'
			} else {
				this.sortColumn = column.name;
				this.sortOrder = 'ASC';
			}

			if (this.sortOrder == 'ASC') 
				this.dataModel.sort(function(a, b) {
					if (a[column.name] < b[column.name])
						return -1;
					if (a[column.name] > b[column.name])
						return 1;
					return 0;
				});
			else
				this.dataModel.sort(function(a, b) {
					if (a[column.name] > b[column.name])
						return -1;
					if (a[column.name] < b[column.name])
						return 1;
					return 0;
				});
		},
		showSortIndicator: function(column) {
			if (column.name == this.sortColumn)
				if (this.sortOrder == 'ASC')
					return this.sortIndicatorAsc;
				else
					return this.sortIndicatorDesc;
			return '';
		},
		goToPage: function(page) {
			if (page >= 1 && page <= this.paginationOptions.lastPage && page != this.paginationOptions.currentPage)
				this.$emit('go-to-page', page);
		},
		changePageSize: function() {
			this.paginationOptions.currentPage = 1;
			this.$emit('go-to-page', this.paginationOptions.currentPage);
			console.log(this.paginationOptions.size);
		}
	},
	computed: {
		visibleColumns: function() {
			var visibleColumns = [];
			for (var i = 0; i < this.columns.length; i ++) {
				if (this.columns[i].visible)
					visibleColumns.push(this.columns[i]);
			}
			return visibleColumns;
		}
	},
	template: '\
	<table v-bind:class="className">\
		<thead>\
			<template v-if="paginationOptions != null && paginationOptions.position == \'top\'">\
				<tr>\
					<td v-bind:colspan="visibleColumns.length">\
						<select name="" id="" v-bind:class="paginationOptions.sizeOptionClass" v-model="paginationOptions.size" v-on:change="changePageSize(this)">\
							<option v-for="option in paginationOptions.sizeOptions" v-bind:value="option">{{ option }}</option>\
						</select>\
						<ul v-bind:class="paginationOptions.paginatorClass">\
							<li><a v-bind:class="paginationOptions.pageOptionClass" v-on:click="goToPage(1)">&laquo;</a></li>\
							<li><a v-bind:class="paginationOptions.pageOptionClass" v-on:click="goToPage(paginationOptions.currentPage - 1)">&lsaquo;</a></li>\
							<li><a v-bind:class="paginationOptions.pageOptionClass">{{ paginationOptions.currentPage }} de {{ paginationOptions.lastPage }}</a></li>\
							<li><a v-bind:class="paginationOptions.pageOptionClass" v-on:click="goToPage(paginationOptions.currentPage + 1)">&rsaquo;</a></li>\
							<li><a v-bind:class="paginationOptions.pageOptionClass" v-on:click="goToPage(paginationOptions.lastPage)">&raquo;</a></li>\
						</ul>\
					</td>\
				</tr>\
			</template>\
			<tr>\
				<th v-for="column in visibleColumns" v-bind:draggable="true" v-on:dragstart="drag(column, $event)" v-on:drop="drop(column, $event)" v-on:dragover="allowDrop(column, $event)"  v-on:click="sort(column)">{{ column.title }} <span v-html="showSortIndicator(column)"></span></th>\
			</tr>\
			<tr v-if="filterEnabled">\
				<td v-for="column in visibleColumns"><input type="text" class="form-control" v-if="column.filterable"></td>\
			</tr>\
		</thead>\
		<tbody>\
			<tr v-for="(row, index) in dataModel">\
				<td v-for="column in visibleColumns" v-bind:class="column.class" >\
					<template v-if="typeof column.customRender == \'function\'">\
						<div v-html="column.customRender(row)"></div>\
					</template>\
					<template v-else-if="column.actionLink != null">\
						<a role="button" v-bind:class="column.actionLink.linkClass" v-on:click="linkEvent(index, row, column)"><span v-bind:class="column.actionLink.iconClass"></span> {{ column.actionLink.text }}</a>\
					</template>\
					<template v-else-if="column.actionButton != null">\
						<button type="button" v-bind:class="column.actionButton.buttonClass" v-on:click="buttonEvent(index, row, column)"><span v-bind:class="column.actionButton.iconClass"></span> {{ column.actionButton.text }}</button>\
					</template>\
					<template v-else-if="column.input != null">\
						<input type="text" v-model="row[column.name]" v-bind:class="column.input.inputClass" v-bind:placeholder="column.input.placeHolder" />\
					</template>\
					<template v-else-if="column.check != null">\
						<input type="checkbox" v-model="row[column.name]" v-bind:class="column.check.checkClass" />\
					</template>\
					<template v-else-if="column.select != null">\
						<select v-model="row[column.name]" v-bind:class="column.select.selectClass">\
							<option v-for="option in column.select.selectOptions" v-bind:value="option.value">{{ option.text }}<option/>\
						</select>\
					</template>\
					<template v-else>\
						{{ row[column.name] }}\
					</template>\
				</td>\
			</tr>\
		</tbody>\
		<tfoot>\
			<template v-if="paginationOptions != null && paginationOptions.position == \'bottom\'">\
				<tr>\
					<td v-bind:colspan="visibleColumns.length">\
						<select name="" id="" v-bind:class="paginationOptions.classSizeOption" v-model="paginationOptions.size" v-on:change="changePageSize(this)">\
							<option v-for="option in paginationOptions.sizeOptions" v-bind:value="option">{{ option }}</option>\
						</select>\
						<ul v-bind:class="paginationOptions.classPaginator">\
							<li><a v-bind:class="paginationOptions.classPageOption" v-on:click="goToPage(1)">&laquo;</a></li>\
							<li><a v-bind:class="paginationOptions.classPageOption" v-on:click="goToPage(paginationOptions.currentPage - 1)">&lsaquo;</a></li>\
							<li><a v-bind:class="paginationOptions.classPageOption">{{ paginationOptions.currentPage }} de {{ paginationOptions.lastPage }}</a></li>\
							<li><a v-bind:class="paginationOptions.classPageOption" v-on:click="goToPage(paginationOptions.currentPage + 1)">&rsaquo;</a></li>\
							<li><a v-bind:class="paginationOptions.classPageOption" v-on:click="goToPage(paginationOptions.lastPage)">&raquo;</a></li>\
						</ul>\
					</td>\
				</tr>\
			</template>\
		</tfoot>\
	</table>'
});
