import { useState } from 'react';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { fincas as fincasData } from '../../data/fincas';
import { productores } from '../../data/productores';

export const Fincas = () => {
  const [fincas, setFincas] = useState(fincasData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFinca, setCurrentFinca] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    id_productor: '',
    ubicacion: ''
  });

  const columns = [
    { field: 'id', header: 'ID' },
    { field: 'nombre', header: 'Nombre' },
    { field: 'codigo', header: 'Código' },
    { 
      field: 'id_productor', 
      header: 'Productor',
      render: (row) => {
        const productor = productores.find(p => p.id === row.id_productor);
        return productor ? productor.nombre : 'No asignado';
      }
    },
    { field: 'ubicacion', header: 'Ubicación' }
  ];

  const producerOptions = productores.map(p => ({
    value: p.id,
    label: p.nombre
  }));

  const handleOpenModal = (finca = null) => {
    if (finca) {
      setCurrentFinca(finca);
      setFormData({ ...finca });
    } else {
      setCurrentFinca(null);
      setFormData({
        nombre: '',
        codigo: '',
        id_productor: '',
        ubicacion: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentFinca(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'id_productor' ? parseInt(value, 10) : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentFinca) {
      // Editar finca existente
      setFincas((prev) =>
        prev.map((f) => (f.id === currentFinca.id ? { ...formData, id: f.id } : f))
      );
    } else {
      // Agregar nueva finca
      const newId = fincas.length > 0 ? Math.max(...fincas.map(f => f.id)) + 1 : 1;
      setFincas((prev) => [...prev, { ...formData, id: newId }]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (finca) => {
    if (window.confirm(`¿Está seguro de eliminar la finca ${finca.nombre}?`)) {
      setFincas((prev) => prev.filter((f) => f.id !== finca.id));
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Fincas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            data={fincas}
            onAdd={() => handleOpenModal()}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            addButtonText="Agregar Finca"
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentFinca ? 'Editar Finca' : 'Agregar Finca'}
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="secondary\" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {currentFinca ? 'Guardar Cambios' : 'Agregar'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Código"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleInputChange}
            required
          />
          <Select
            label="Productor"
            id="id_productor"
            name="id_productor"
            value={formData.id_productor}
            onChange={handleInputChange}
            options={producerOptions}
            required
          />
          <Input
            label="Ubicación"
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleInputChange}
            required
          />
        </form>
      </Modal>
    </div>
  );
};