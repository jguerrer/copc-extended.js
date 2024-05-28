/**
 * Implenentation and interface  for reading and writing COPC for spatial editing.
 * 
 * 
 * Overall Structure:
 * 
 * By reading the first 589 bytes 
 * (375 for the header 
 * + 54 for the COPC VLR header , which are useless
 * + 160 for the COPC VLR      , Corresponds to the actual info VLR and follows COPCInfo
 * 
 * 
 * lITTLE ENDIAN ENCODING
 * struct CopcInfo
{
  double center_x;  // Actual (unscaled) X coordinate of center of octree
  double center_y; // Actual (unscaled) Y coordinate of center of octree
  double center_z; // Actual (unscaled) Z coordinate of center of octree
  double halfsize;   // Perpendicular distance from the center to any side of the root node.
  
  32 BYTES SO FAR

  double spacing;// Space between points at the root node.   // This value is halved at each octree level
  uint64_t root_hier_offset;// File offset to the first hierarchy page
  uint64_t root_hier_size;  // Size of the first hierarchy page in bytes
  double gpstime_minimum;// Minimum of GPSTime
  64 BYTES SO FAR
  double gpstime_maximum;// Maximum of GPSTime
  uint64_t reserved[11];// Must be 0

  80 BYTES SO FAR
};
 * 
 * 
 * 
 * 
 * 
 * The COPS structure startw with 
 * [header, 589] [points][chunk table] [copc evlr],
 * 
 * [header] is 589 bytes length , but extra info lies after that
 * [743, 597] contains projection byt may be 
 
* [points] follow typical pointcloud secuential structure with a record length
 * [copc evlr] contains the ept hierarchy pages and start at the start of offset
 * is an consecutive list of Entry's made of 
 * 
 struct VoxelKey
{
  // A value < 0 indicates an invalid VoxelKey
  int32_t level;
  int32_t x;
  int32_t y;
  int32_t z;
} 16 bytes

struct Entry
{
  // EPT key of the data to which this entry corresponds
  VoxelKey key; //16 bytes

  // Absolute offset to the data chunk if the pointCount > 0.
  // Absolute offset to a child hierarchy page if the pointCount is -1.
  // 0 if the pointCount is 0.
  uint64_t offset; //8 bytes

  // Size of the data chunk in bytes (compressed size) if the pointCount > 0.
  // Size of the hierarchy page if the pointCount is -1.
  // 0 if the pointCount is 0.
  int32_t byteSize;  //4 bytes compressed

  // If > 0, represents the number of points in the data chunk.
  // If -1, indicates the information for this octree node is found in another hierarchy page.
  // If 0, no point data exists for this key, though may exist for child entries.
  int32_t pointCount;  //total point count per page
}


//lo que falta es descomprimir los datos en el offset y de ese tamanio.

 * 
 * 
 * copc evlr are at the end of the file as an extension 
 * 
 * 
 * Readers should : 
 * verify that the first four bytes of the file contain the ASCII characters “LASF”.
 * verify that the 4 bytes starting at offset 377 contain the characters copc. (after header)
 * verify that the bytes at offsets 393 and 394 contain the values 1 and 0, respectively 
   (this is the COPC version number, 1).
 * determine the point data record format by reading the byte at offset 104, 
   masking off the two high bits, which are used by LAZ to indicate compression, and can be ignored.
 * determine the point data record length by reading two bytes at offset 105.
 * 
 * 
 * after header, data is organized like ept.
 * 
 * 
 * 
 * 
 * 
 * Based on the provided example, reading requires
 * 
 * 1) Creating the COPC object with 
 *          let copc =  Copc.create (filename)
 * 2) Loading hierarchy Page
 *      {nodes, pages }copc.loadHierarchyPage(filename, copc)
 * 
 *  Nodes and pages are different. 
 * 
 * 3) 
 * 
 */


// a partir de la informacion de las paginas y la jerarquia, se debe realizar una funcion de busqueda
// No sabemos si van indexados porque eso depende del orden original, pero como no existie esto,
// hay que realizar busqueda espacial.
// seria interesante almacenar en una db los bloques de laz, pero seria caro o buscar alguna otra forma de acelerar.

//las operaciones basicas de nube de puntos son modificando sus atributos por lo que se requiere ubicar el punto exacto.
//en general no se borran puntos, solo se modifica el atribut witheld 

//si lo que se desea es cambia su clasificacion, se actualiza el atributo

//para borrar  o  modificar un punto idnividual, se debe atravesar la jerarquia y cuando se encuentre el voxel inicial, 
//se busca numericamente el punto dentro del voxel y recursivamente hasta coincidir a tal precision
//esto implica buscar dentro de todos los niveles del octree, y todos los puntos.

//esta operacion es cara  porque la busqueda de un nivel no implica haber encontrado el punto.
//para facilitar la actualizacion, se procede primero al nivel mas bajo  que concida y se sigue buscando en un nivel superior.

//si se encuentra, el punto, podriamos parar.

// Es relevante evaluar como es que se establece la estructura o distribucion de puntos para poder acelerar las cosas

//si en potree supieramos en que nivel y escala funcionan, podriamos mandar dicha informacion a esta cosa


// pages tienen -1 en point countt, por lo que no tienen datos, sino mas nodos.
//no hay propiamente diferencia en tree ellos, solo indican que ellos no cotienen datos inmediatamente


//no da detalles pero mermite modificar individualmente los atributos de un punto
function updatePoint({}):void{

}
//  https://validate.copc.io/
// https://github.com/hobuinc/laz-perf

//performs a point search per page updates whatever falls within the polygon and distance function
//another option is to provide a 3d shape and find objects within
//many options to select points will be addressed here.
//simples ones are 3d boxes, which can be easily split into tetrahedrals.

//is not the fastest way but the limited number of points per level helps to reduce the number of comparisions.


//the final trick is to take the compressed block and uncompress it and compress it back
//check https://validate.copc.io/

function updatePoints( polygon:string, {attrbutes:[]}):void{

}

























