import { Users, Landmark, Map, Apple, FileCheck, Package, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { getAll } from '../services/productorService';
import { useEffect, useState } from 'react';
import { getAllFincas } from '../services/fincaService';
import { getAllLotes } from '../services/loteService';
import { getAllTipofrutas } from '../services/tipofrutaService';
import { getAllRemisiones } from '../services/remisionService';
import { getAllEmbalajes } from '../services/embalajeService';
import { getAllEmbarques } from '../services/embarqueService';

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const [productores, setProductores] = useState([]);
  const [fincas, setFincas] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [frutas, setFrutas] = useState([]);
  const [recepcion, setRecepcion] = useState([]);
  const [embalaje, setEmbalaje] = useState([]);
  const [embarque, setEmbarque] = useState([]);
  useEffect(() => {
      loadData();
      console.log(embarque)
  }, []);

  const loadData = async () => {
      try {
          const [productoresData, fincasData, lotesData, frutasData, recepcionData, embalajeData, embarqueData] = await Promise.all([
              getAll(),
              getAllFincas(),
              getAllLotes(),
              getAllTipofrutas(),
              getAllRemisiones(),
              getAllEmbalajes(),
              getAllEmbarques(),
          ]);
          setProductores(productoresData);
          setFincas(fincasData);
          setLotes(lotesData)
          setFrutas(frutasData)
          setRecepcion(recepcionData.sort((a, b)=> (b.numero) - (a.numero)))
          setEmbalaje(embalajeData)
          setEmbarque(
            embarqueData.sort((a, b) => new Date(b.numero) - new Date(a.numero))
          )
      } catch (err) {
          setError('Error al cargar los datos');
          console.error('Error:', err);
      } finally {

      }
  };

  const stats = [
    {
      title: 'Productores',
      value: productores.length,
      icon: <Users className="text-blue-600" size={24} />,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'Fincas',
      value: fincas.length,
      icon: <Landmark className="text-green-600\" size={24} />,
      color: 'bg-green-50 border-green-200',
    },
    {
      title: 'Lotes',
      value: lotes.length,
      icon: <Map className="text-purple-600" size={24} />,
      color: 'bg-purple-50 border-purple-200',
    },
    {
      title: 'Frutas',
      value: frutas.length,
      icon: <Apple className="text-red-600\" size={24} />,
      color: 'bg-red-50 border-red-200',
    },
    {
      title: 'Recepciones',
      value: recepcion.length,
      icon: <FileCheck className="text-yellow-600" size={24} />,
      color: 'bg-yellow-50 border-yellow-200',
    },
    {
      title: 'Embalajes',
      value: embalaje.length,
      icon: <Package className="text-indigo-600\" size={24} />,
      color: 'bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Embarques',
      value: embarque.length,
      icon: <Truck className="text-orange-600" size={24} />,
      color: 'bg-orange-50 border-orange-200',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Bienvenido, <span className="font-medium">{currentUser?.username}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className={`border ${stat.color}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className="p-3 rounded-full bg-white shadow-sm">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Recepciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recepcion.slice(0, 3).map((item) => {
                const lote = lotes.find((l) => l.id === item.id_lote);
                const finca = lote ? fincas.find((f) => f.id === lote.id_finca) : null;
                
                return (
                  <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
                      <FileCheck className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{item.RemisionRelaciones[0].productor.nombre || 'Finca desconocida'}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(item.fechaRecepcion).toLocaleDateString()} - {item.cantidad} {item.unidad}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Embarques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {embarque.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="bg-orange-100 p-2 rounded-full mr-4">
                    <Truck className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{item.destino}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(item.fechaDespacho).toLocaleDateString()} - {item.numero}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};