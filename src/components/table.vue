<template>
  <div>
    <md-table v-model="templates" md-card @md-selected="onSelect" md-fixed-header>
      <md-table-empty-state
        md-label="No template found">
      </md-table-empty-state>
      <md-table-row
        slot="md-table-row"
        slot-scope="{ item }"
        md-selectable="multiple"
        md-auto-select
      >
        <md-table-cell md-label="id">{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Name">{{ item.name }}</md-table-cell>
        <md-table-cell md-label="Masking">{{ item.masking }}</md-table-cell>
        <md-table-cell md-label="Params">{{ item.params }}</md-table-cell>
        <md-table-cell md-label="Actions"
          ><md-button class="md-primary" @click="showDialogAdd = true, isAddTemplate=false, setTemplate(item)"
            >EDIT</md-button
          ></md-table-cell
        >
      </md-table-row>
    </md-table>

    <div class="center mt-2">
      <md-button @click="showDialogAdd = true, isAddTemplate=true" class="md-raised md-primary"
        >ADD</md-button
      >
      <md-button class="md-raised md-accent" @click="activeDelete=true" v-if="selected.length>0">REMOVE</md-button>
    </div>
    <md-dialog :md-active.sync="showDialogAdd">
      <md-dialog-title>{{isAddTemplate?"Add Template":"Edit Template"}}</md-dialog-title>
      <div class="create-project-home">
        <div v-if="isLoading" class="absolute-center">
          <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
        <md-content :class="isLoading?'padding-8 disbled':'padding-8'">
          <md-field :class="messageClass">
            <label>Id</label>
            <md-input
              v-model="tfId"
              maxlength="255"
              placeholder="[Auto]"
            ></md-input>
            <span class="md-error">The modified id has already been taken.</span>
          </md-field>
          <md-field>
            <label>Name*</label>
            <md-input v-model="tfName" maxlength="255"></md-input>
          </md-field>
          <div @click="showDialogChill=true">
            <md-field>
              <label>Masking</label>
              <md-input v-model="tfMasking"></md-input>
            </md-field>
          </div>
          <div @click="showDialogChill=true">
            <md-field>
              <label>Params</label>
              <md-input v-model="tfParams"></md-input>
            </md-field>
          </div>
        </md-content>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="setTemplateNull"
          >Cancel</md-button
        >
        <md-button v-if="isAddTemplate" class="md-primary" @click="Loaded(AddTemplate)" :disabled="isDisabled"
          >Ok</md-button
        >
        <md-button v-else class="md-primary" @click="Loaded(EditTemplate)" :disabled="isDisabled"
          >Ok</md-button
        >
      </md-dialog-actions>

      <md-dialog :md-active.sync="showDialogChill">
        <md-content class="padding-8">
          <md-field>
            <label for="algorithm">Algorithm</label>
            <md-select v-model="tfMasking2" name="algorithm" id="algorithm">
              <div @click="tfParams2=dataSl.text[0]">
                <md-option value="Text" >Text</md-option>
              </div>
              <div @click="tfParams2=dataSl.integer[0]">
                <md-option value="Integer">Integer</md-option>
              </div>
              <div @click="tfParams2=dataSl.float[0]">
                <md-option value="Float">Float</md-option>
              </div>
              <div @click="tfParams2=dataSl.dictionary[0]">
                <md-option value="Dictionary">Dictionary</md-option>
              </div>
              <div @click="tfParams2=dataSl.segment[0]">
                <md-option value="Segment">Segment</md-option>
              </div>
            </md-select>
          </md-field>
          <md-field>
            <label for="params">Params</label>
            <md-select v-model="tfParams2" name="params" id="params">
              <div v-if="tfMasking2==='Text'">
                <md-option v-for="(item,index) in dataSl.text" :key="index" :value="item">{{item}}</md-option>
              </div>
              <div v-else-if="tfMasking2==='Integer'">
                <md-option v-for="(item,index) in dataSl.integer" :key="index" :value="item">{{item}}</md-option>
              </div>
              <div v-else-if="tfMasking2==='Float'">
                <md-option v-for="(item,index) in dataSl.float" :key="index" :value="item">{{item}}</md-option>
              </div>
              <div v-else-if="tfMasking2==='Dictionary'">
                <md-option v-for="(item,index) in dataSl.dictionary" :key="index" :value="item">{{item}}</md-option>
              </div>
              <div v-else-if="tfMasking2==='Segment'">
                <md-option v-for="(item,index) in dataSl.segment" :key="index" :value="item">{{item}}</md-option>
              </div>
            </md-select>
          </md-field>
        </md-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="showDialogChill = false">Close</md-button>
          <md-button class="md-primary" @click="showDialogChill = false, tfMasking=tfMasking2,tfParams=tfParams2">Save</md-button>
        </md-dialog-actions>
      </md-dialog>

    </md-dialog>
    <md-dialog-confirm
      :md-active.sync="activeDelete"
      md-title="Delete template"
      :md-content="
        selected.length>1?`Are you sure you want to delete these templates ?`:`Are you sure you want to delete template ${selected[0]?selected[0].name:''} ?`
      "
      md-confirm-text="OK"
      md-cancel-text="CANCEL"
      @md-confirm="RemoveTemplate"
    />
  </div>
</template>

<script>
const isDuplicate = (arr, newId)=>{
  return arr.some(function(e) {
    return e.id === newId;
  });
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export default {
  name: "Table",
  props: {
    templates: Array,
    selected: Array,
    onSelect: Function,
  },
  data: () => ({
    showDialogAdd: false,
    showDialogChill:false,
    tfId: null,
    tfName: null,
    tfMasking:"Text",
    tfParams:"Keep type",
    tfMasking2:"Text",
    tfParams2:"Keep type",
    dataSl:{
      text:['Keep type','Custom','Fix'],
      integer:['Keep digits','Min max','No limits'],
      float:['Keep digits','No limits'],
      dictionary:['file1','file2','file3'],
      segment:['Prefix','Suffix','Delimiter']
    },
    hasMessages: false,
    activeDelete:false,
    isAddTemplate:true,
    idTemp:null,
    isLoading:false
  }),
  methods: {
    async Loaded(callback){
      this.isLoading = true
      await sleep(1000).then(() => {
        this.isLoading = false
        callback()
      });
    },
    EditTemplate() {
      if(this.idTemp===this.tfId || !isDuplicate(this.templates,this.tfId)){
        const index = this.templates.findIndex(x=>x.id===this.idTemp);
        const newItem = {
          id: this.tfId?this.tfId:Date.now().toString(),
          name: this.tfName,
          masking: this.tfMasking,
          params: this.tfParams,
        }
        this.templates[index]=newItem;
        this.setTemplateNull();
        localStorage.setItem("templates", JSON.stringify(this.templates));
      } else{
        this.hasMessages=true
      }
    },
    setTemplate(item){
      this.tfId=item.id;
      this.tfName=item.name;
      this.tfMasking=item.masking;
      this.tfParams=item.params
      this.idTemp=item.id
    },
    setTemplateNull(){
      this.tfName=null
      this.hasMessages=false
      this.tfId=null
      this.showDialogAdd=false
      this.showDialogChill=false
    },
    AddTemplate(){
      if(isDuplicate(this.templates,this.tfId)){
        this.hasMessages=true
      }else{
        const newItem={
          id:this.tfId?this.tfId:Date.now().toString(),
          name: this.tfName,
          masking:this.tfMasking,
          params:this.tfParams
        }
        this.templates.push(newItem);
        this.setTemplateNull()
        localStorage.setItem("templates", JSON.stringify(this.templates));
      }
    },
    RemoveTemplate(){
      let arrIndex = this.templates.reduce((r, n, i) => {
        this.selected.includes(n) && r.push(i);
        return r;
      }, []);
      for (let i = arrIndex.length -1; i >= 0; i--){
        this.templates.splice(arrIndex[i],1);
      }
      localStorage.setItem("templates", JSON.stringify(this.templates));
    }
  },
  computed: {
    isDisabled() {
      return !this.tfName
    },
    messageClass () {
      return {
        'md-invalid': this.hasMessages
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.padding-8 {
  padding: 30px;
}
.create-project-home {
  min-width: 400px;
  max-width: 600px;
  width: 100%;
  margin: 10px auto;
}
.absolute-center{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.disbled{
  cursor: default;
  pointer-events: none;
  opacity: 0.5;
}
</style>
