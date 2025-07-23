import React, { useState, useEffect } from 'react';
import { getAll, remove } from '../../services/productorService';
import { getAllFincas, deleteFinca } from '../../services/fincaService';
import { getAllLotes, deleteLote } from '../../services/loteService';
import { getAllCerticas, deleteCertica } from '../../services/certicaService';
import { getAllGGNs } from '../../services/ggnService';
import ProductorForm from './ProductorForm';
import FincaForm from './FincaForm';
import LoteForm from './LoteForm';
import AsignarFrutaForm from '../frutas/AsignarFrutaForm';
import CerticaForm from '../certificaciones/CerticaForm';
import GGNForm from './GGNForm';

const Productores = () => {
    const [productores, setProductores] = useState([]);
    const [fincas, setFincas] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [certificaciones, setCertificaciones] = useState([]);
    const [ggns, setGGNs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showFincaForm, setShowFincaForm] = useState(false);
    const [showLoteForm, setShowLoteForm] = useState(false);
    const [showAsignarFrutaForm, setShowAsignarFrutaForm] = useState(false);
    const [showCerticaForm, setShowCerticaForm] = useState(false);
    const [showGGNForm, setShowGGNForm] = useState(false);
    const [selectedProductorId, setSelectedProductorId] = useState(null);
    const [selectedFincaId, setSelectedFincaId] = useState(null);
    const [selectedLoteId, setSelectedLoteId] = useState(null);
    const [selectedCerticaId, setSelectedCerticaId] = useState(null);
    const [selectedGGNId, setSelectedGGNId] = useState(null);
    const [showDetalle, setShowDetalle] = useState(false);
    const [selectedProductor, setSelectedProductor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: 'codigo',
        direction: 'asc'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productoresData, fincasData, lotesData, certificacionesData, ggnsData] = await Promise.all([
                getAll(),
                getAllFincas(),
                getAllLotes(),
                getAllCerticas(),
                getAllGGNs()
            ]);
            setProductores(productoresData);
            setFincas(fincasData);
            setLotes(lotesData);
            setCertificaciones(certificacionesData);
            setGGNs(ggnsData);
        } catch (err) {
            setError('Error al cargar los datos');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este productor?')) {
            try {
                setLoading(true);
                await remove(id);
                await loadData();
            } catch (err) {
                setError('Error al eliminar el productor');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteFinca = async (fincaId) => {
        if (window.confirm('¿Está seguro de eliminar esta finca?')) {
            try {
                setLoading(true);
                await deleteFinca(fincaId);
                await loadData();
            } catch (err) {
                setError('Error al eliminar la finca');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteLote = async (loteId) => {
        if (window.confirm('¿Está seguro de eliminar este lote?')) {
            try {
                setLoading(true);
                await deleteLote(loteId);
                await loadData();
            } catch (err) {
                setError('Error al eliminar el lote');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteCertica = async (id) => {
        if (window.confirm('¿Está seguro de eliminar esta certificación?')) {
            try {
                setLoading(true);
                await deleteCertica(id);
                await loadData();
            } catch (err) {
                setError('Error al eliminar la certificación');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        setShowForm(false);
        setSelectedProductorId(null);
        await loadData();
    };

    const handleFincaSave = async () => {
        setShowFincaForm(false);
        setSelectedFincaId(null);
        await loadData();
    };

    const handleLoteSave = async () => {
        setShowLoteForm(false);
        setSelectedLoteId(null);
        await loadData();
    };

    const handleAsignarFruta = (lote) => {
        setSelectedLoteId(lote.id);
        setShowAsignarFrutaForm(true);
    };

    const handleAsignarFrutaSave = async () => {
        setShowAsignarFrutaForm(false);
        setSelectedLoteId(null);
        await loadData();
    };

    const handleCerticaSave = async () => {
        setShowCerticaForm(false);
        setSelectedCerticaId(null);
        await loadData();
    };

    const handleGGNSave = async () => {
        setShowGGNForm(false);
        setSelectedGGNId(null);
        await loadData();
    };

    const getFincasByProductor = (productorId) => {
        return fincas.filter(finca => finca.productorId === productorId);
    };

    const getLotesByFinca = (fincaId) => {
        console.log(lotes.filter(lote => lote.fincaId === fincaId))
        return lotes.filter(lote => lote.fincaId === fincaId);
    };

    const getCerticasByFinca = (fincaId) => {
        return certificaciones.filter(certica => certica.fincaId === fincaId);
    };

    const getGGNsByProductor = (productorId) => {
        return ggns.filter(ggn => ggn.productorId === productorId);
    };

    const handleVerDetalle = (productor) => {
        setSelectedProductor(productor);
        setShowDetalle(true);
        console.log(productor)
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const getSortedAndFilteredProductores = () => {
        let filteredProductores = productores;

        // Aplicar filtro de búsqueda
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredProductores = productores.filter(productor => 
                productor.nombre.toLowerCase().includes(searchLower) ||
                productor.codigo.toLowerCase().includes(searchLower)
            );
        }

        // Aplicar ordenamiento
        return [...filteredProductores].sort((a, b) => {
            if (sortConfig.key === 'codigo' || sortConfig.key === 'nombre') {
                if (sortConfig.direction === 'asc') {
                    return a[sortConfig.key].localeCompare(b[sortConfig.key]);
                }
                return b[sortConfig.key].localeCompare(a[sortConfig.key]);
            }
            return 0;
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (showDetalle && selectedProductor) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setShowDetalle(false)}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            ← Volver
                        </button>
                        <h1 className="text-2xl font-bold">Detalle del Productor</h1>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => {
                                setSelectedProductorId(selectedProductor.id);
                                setShowGGNForm(true);
                            }}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            + Nuevo GGN
                        </button>
                        <button
                            onClick={() => {
                                setSelectedProductorId(selectedProductor.id);
                                setShowFincaForm(true);
                            }}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            + Nueva Finca
                        </button>
                    </div>
                </div>

                

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">{selectedProductor.nombre}</h2>
                    <p className="text-gray-600">Código: {selectedProductor.codigo}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6 ">
                    <h3 className="text-lg font-bold mb-4">Fincas</h3>
                    <div className="space-y-4">
                        {getFincasByProductor(selectedProductor.id).map(finca => (
                            <div key={finca.id} className="bg-gray-50 p-4 rounded">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{finca.nombre}</p>
                                        <p className="text-sm text-gray-600">Código: {finca.codigo}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        {
                                            <button
                                            hidden
                                            onClick={() => {
                                                setSelectedFincaId(finca.id);
                                                setShowFincaForm(true);
                                            }}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Editar
                                        </button>
                                        }
                                        {//<button
                                         //   onClick={() => handleDeleteFinca(finca.id)}
                                         //   className="text-red-500 hover:text-red-700"
                                        //>
                                        //</div>    Eliminar
                                        //</div></button>
                                        }
                                    </div>
                                </div>
                                
                                {/* Sección de Lotes */}
                                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium">Lotes</h4>
                                        <button
                                            onClick={() => {
                                                setSelectedFincaId(finca.id);
                                                setShowLoteForm(true);
                                            }}
                                            className="text-green-500 hover:text-green-700 text-sm"
                                        >
                                            + Nuevo Lote
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {getLotesByFinca(finca.id).map(lote => (
                                            <div key={lote.id} className="bg-white p-2 rounded flex justify-between items-center">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium">Lote {lote.numero}{lote.frutaLote?.frutum?.nombre}</span>
                                                        {lote.frutaLote  ? (
                                                            <div className="ml-3 flex items-center space-x-2">
                                                                <span className="text-xs text-gray-700">{lote.frutaLote?.frutum?.nombre}</span>
                                                                <button
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200"
                                                                    onClick={() => handleAsignarFruta(lote)}
                                                                >
                                                                    Ver
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="ml-3 text-xs text-gray-500">Sin fruta asignada</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleAsignarFruta(lote)}
                                                        className={`text-sm px-3 py-1 rounded ${
                                                            lote.fruta && lote.frutaLote?.length > 0
                                                                ? 'text-blue-500 hover:text-blue-700 border border-blue-500 hover:border-blue-700' 
                                                                : 'text-green-500 hover:text-green-700 border border-green-500 hover:border-green-700'
                                                        }`}
                                                    >
                                                        {lote.frutaLote && lote.frutaLote.length > 0 ? 'Cambiar Fruta' : 'Asignar Fruta'}
                                                    </button>
                                                    <button
                                                    hidden
                                                        onClick={() => {
                                                            setSelectedLoteId(lote.id);
                                                            setSelectedFincaId(finca.id);
                                                            setShowLoteForm(true);
                                                        }}
                                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                                    >
                                                        Editar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sección de Certificaciones */}
                                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-medium">Certificaciones</h4>
                                        <button
                                            onClick={() => {
                                                setSelectedFincaId(finca.id);
                                                setShowCerticaForm(true);
                                            }}
                                            className="text-green-500 hover:text-green-700 text-sm"
                                        >
                                            + Nueva Certificación
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {getCerticasByFinca(finca.id).map(certica => (
                                            <div key={certica.id} className="bg-white p-2 rounded flex justify-between items-center">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium">Cert. {certica.numero}</span>
                                                        <div className="ml-3 flex items-center space-x-2">
                                                            <div className="text-xs text-gray-500 space-x-2">
                                                                <span>Emisión: {new Date(certica.fechaEmision).toLocaleDateString()}</span>
                                                                <span>•</span>
                                                                <span>Vencimiento: {new Date(certica.fechaVencimiento).toLocaleDateString()}</span>
                                                                <span>•</span>
                                                                <span className={`capitalize ${
                                                                    new Date(certica.fechaVencimiento) > new Date()
                                                                        ? 'text-green-600'
                                                                        : 'text-red-600'
                                                                }`}>
                                                                    {new Date(certica.fechaVencimiento) > new Date() ? 'Vigente' : 'Vencido'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                    hidden
                                                        onClick={() => {
                                                            setSelectedCerticaId(certica.id);
                                                            setSelectedFincaId(finca.id);
                                                            setShowCerticaForm(true);
                                                        }}
                                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                                    >
                                                        Editar
                                                    </button>
                                                    {
                                                    //    onClick={() => handleDeleteCertica(certica.id)}
                                                    //    className="text-red-500 hover:text-red-700 text-sm"
                                                    //    <button
                                                    //>
                                                    //    Eliminar
                                                    //</button>
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Sección de GGNs del Productor */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-bold mb-4">GGN</h3>
                    <div className="space-y-2">
                        {getGGNsByProductor(selectedProductor.id).map(ggn => (
                            <div key={ggn.id} className="bg-white p-2 rounded flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium">GGN {ggn.numero}</span>
                                    <div className="text-xs text-gray-500 space-x-2">
                                        <span>Emisión: {new Date(ggn.fechaEmision).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>Vencimiento: {new Date(ggn.fechaVencimiento).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span className={`capitalize ${
                                            new Date(ggn.fechaVencimiento) > new Date()
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}>
                                            {new Date(ggn.fechaVencimiento) > new Date() ? 'Vigente' : 'Vencido'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {(showForm || showFincaForm || showLoteForm || showAsignarFrutaForm || showCerticaForm || showGGNForm) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                            {showForm && (
                                <ProductorForm
                                    productorId={selectedProductorId}
                                    onSave={handleSave}
                                    onCancel={() => {
                                        setShowForm(false);
                                        setSelectedProductorId(null);
                                    }}
                                />
                            )}
                            {showFincaForm && (
                                <FincaForm
                                    fincaId={selectedFincaId}
                                    productorId={selectedProductorId}
                                    onSave={handleFincaSave}
                                    onCancel={() => {
                                        setShowFincaForm(false);
                                        setSelectedFincaId(null);
                                    }}
                                />
                            )}
                            {showLoteForm && (
                                <LoteForm
                                    loteId={selectedLoteId}
                                    fincaId={selectedFincaId}
                                    onSave={handleLoteSave}
                                    onCancel={() => {
                                        setShowLoteForm(false);
                                        setSelectedLoteId(null);
                                    }}
                                />
                            )}
                            {showAsignarFrutaForm && (
                                <AsignarFrutaForm
                                    lote={lotes.find(l => l.id === selectedLoteId)}
                                    onSave={handleAsignarFrutaSave}
                                    onCancel={() => {
                                        setShowAsignarFrutaForm(false);
                                        setSelectedLoteId(null);
                                    }}
                                />
                            )}
                            {showCerticaForm && (
                                <CerticaForm
                                    certicaId={selectedCerticaId}
                                    fincaId={selectedFincaId}
                                    onSave={handleCerticaSave}
                                    onCancel={() => {
                                        setShowCerticaForm(false);
                                        setSelectedCerticaId(null);
                                    }}
                                />
                            )}
                            {showGGNForm && (
                                <GGNForm
                                    ggnId={selectedGGNId}
                                    productorId={selectedProductorId}
                                    onSave={handleGGNSave}
                                    onCancel={() => {
                                        setShowGGNForm(false);
                                        setSelectedGGNId(null);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Productores</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    + Nuevo Productor
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('nombre')}
                            >
                                Nombre {sortConfig.key === 'nombre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('codigo')}
                            >
                                Código {sortConfig.key === 'codigo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Número de Fincas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {getSortedAndFilteredProductores().map(productor => (
                            <tr key={productor.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {productor.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {productor.codigo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getFincasByProductor(productor.id).length}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleVerDetalle(productor)}
                                        className="text-blue-500 hover:text-blue-700 mr-4"
                                    >
                                        Ver
                                    </button>
                                    <button
                                    hidden
                                        onClick={() => {
                                            setSelectedProductorId(productor.id);
                                            setShowForm(true);
                                        }}
                                        className="text-blue-500 hover:text-blue-700 mr-4"
                                    >
                                        Editar
                                    </button>
                                    {
                                    //    <button
                                    //    onClick={() => handleDelete(productor.id)}
                                    //    className="text-red-500 hover:text-red-700"
                                    //>
                                    //    Eliminar
                                    //</button>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(showForm || showFincaForm || showLoteForm || showAsignarFrutaForm || showCerticaForm || showGGNForm) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                        {showForm && (
                            <ProductorForm
                                productorId={selectedProductorId}
                                onSave={handleSave}
                                onCancel={() => {
                                    setShowForm(false);
                                    setSelectedProductorId(null);
                                }}
                            />
                        )}
                        {showFincaForm && (
                            <FincaForm
                                fincaId={selectedFincaId}
                                productorId={selectedProductorId}
                                onSave={handleFincaSave}
                                onCancel={() => {
                                    setShowFincaForm(false);
                                    setSelectedFincaId(null);
                                }}
                            />
                        )}
                        {showLoteForm && (
                            <LoteForm
                                loteId={selectedLoteId}
                                fincaId={selectedFincaId}
                                onSave={handleLoteSave}
                                onCancel={() => {
                                    setShowLoteForm(false);
                                    setSelectedLoteId(null);
                                }}
                            />
                        )}
                        {showAsignarFrutaForm && (
                            <AsignarFrutaForm
                                lote={lotes.find(l => l.id === selectedLoteId)}
                                onSave={handleAsignarFrutaSave}
                                onCancel={() => {
                                    setShowAsignarFrutaForm(false);
                                    setSelectedLoteId(null);
                                }}
                            />
                        )}
                        {showCerticaForm && (
                            <CerticaForm
                                certicaId={selectedCerticaId}
                                fincaId={selectedFincaId}
                                onSave={handleCerticaSave}
                                onCancel={() => {
                                    setShowCerticaForm(false);
                                    setSelectedCerticaId(null);
                                }}
                            />
                        )}
                        {showGGNForm && (
                            <GGNForm
                                ggnId={selectedGGNId}
                                productorId={selectedProductorId}
                                onSave={handleGGNSave}
                                onCancel={() => {
                                    setShowGGNForm(false);
                                    setSelectedGGNId(null);
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Productores; 