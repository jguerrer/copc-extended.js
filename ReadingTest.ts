import { Copc, Constants, Hierarchy, Info } from './src/copc';
import './src/utils';



 const main= async function() {
  console.log('----- Parse COPC header and walk and walk VLT and EVLR metadata ------------------------------------------')

  let filename = './data/t69_down.copc.laz'
  //let filename = './data/Tower90-99.copc.laz'
  //let filename = './data/Tower90-99.laz'
  console.log(filename)
  const copc = await Copc.create(filename);// must be renamed as parseMetadata
  console.log('-----------------------------------------------')

  console.log(copc)

  console.log('------ Parsing Hierarchy Pages using  Hierarchy.load and copc-----------------------------------------')
  
  //this loads a hierarchy page at a given offset position and page size
  const { nodes, pages } = await Copc.loadHierarchyPage(
    filename,
    copc.info.rootHierarchyPage
  )

  // checking nodes and pages

  const root = nodes['0-0-0-0']!; //root node starts at depth 0
  const view = await Copc.loadPointDataView(filename, copc, root);//parses file and uses loadPointDataBuffer -> compressed and decompress
  console.log('-----------------------------------------------');
  console.log('Dimensions:', view.dimensions);
  
  const getters = ['X', 'Y', 'Z', 'Intensity','Classification'].map(view.getter)
  function getXyzi(index: number) {
    return getters.map(get => get(index))
  }
  const point = getXyzi(0); //this is how you get each point fron the node nodes['0-0-0-0'].pointCount
  //pointDataLength 
  console.log('-----------------------------------------------')
  console.log('Point:', point)
  console.log("Point Size:" , root.pointDataLength / root.pointCount)
  console.log('-----------------------------------------------')

}
main();