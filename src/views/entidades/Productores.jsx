import { useState } from 'react';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { productores as productoresData } from '../../data/productores';

export const Productores = () => {
  const [productores, setProductores] = useState(productoresData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProductor, setCurrentProductor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    direccion: '',
    telefono: ''
  });

  const columns = [
    { field: 'id', header: 'ID' },
    { field: 'nombre', header: 'Nombre' },
    { field: 'codigo', header: 'Código' },
    { field: 'direccion', header: 'Dirección' },
    { field: 'telefono', header: 'Teléfono' }
  ];

  const handleOpenModal = (productor = null) => {
    if (productor) {
      setCurrentProductor(productor);
      setFormData({ ...productor });
    } else {
      setCurrentProductor(null);
      setFormData({
        nombre: '',
        codigo: '',
        direccion: '',
        telefono: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProductor(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentProductor) {
      // Editar productor existente
      setProductores((prev) =>
        prev.map((p) => (p.id === currentProductor.id ? { ...formData, id: p.id } : p))
      );
    } else {
      // Agregar nuevo productor
      const newId = productores.length > 0 ? Math.max(...productores.map(p => p.id)) + 1 : 1;
      setProductores((prev) => [...prev, { ...formData, id: newId }]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (productor) => {
    if (window.confirm(`¿Está seguro de eliminar al productor ${productor.nombre}?`)) {
      setProductores((prev) => prev.filter((p) => p.id !== productor.id));
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Productores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            columns={columns}
            data={productores}
            onAdd={() => handleOpenModal()}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            addButtonText="Agregar Productor"
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentProductor ? 'Editar Productor' : 'Agregar Productor'}
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="secondary\" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {currentProductor ? 'Guardar Cambios' : 'Agregar'}
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
          <Input
            label="Dirección"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Teléfono"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
            required
          />
        </form>
      </Modal>
    </div>
  );
};