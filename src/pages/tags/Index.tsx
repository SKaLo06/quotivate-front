import React, { useState, useEffect } from 'react';
import { Col, Button, Row, Card, Form, Collapse, Table } from 'react-bootstrap';
import { getCategoris, deleteCategorie, createCategorie } from 'services/categoriesService';
import CateogieInterface from 'types/interfaces/categorie.interface';
import CustomModal from 'components/ui/costumeModal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AxiosResponse } from 'axios';
import { HttpResponse } from 'types';
import UpdateForm from 'pages/tags/components/UpdateForm';

const schema = Yup.object().shape({
    name: Yup.string().required('Required'),
});
interface MyFormValues {
    name: string;
}
const TagsIndexPage: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [currentCategory, setcurrentCategory] = useState<CateogieInterface | null>(null);
    const [categories, setCategories] = useState<CateogieInterface[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const openDeleteModal = (category: CateogieInterface) => {
        setcurrentCategory(category);
        setShowModal(true);
    };
    const openUpdateModal = (category: CateogieInterface) => {
        setcurrentCategory(category);
        setShowUpdateModal(true);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getCategoris();
                setCategories(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        loadData();
    }, []);
    const submitForm = async (values: MyFormValues, actions: any) => {
        try {
            const { data }: AxiosResponse<HttpResponse<CateogieInterface>> = await createCategorie(values);
            setCategories([...categories, data.realData!]);
            setOpen(false);
            actions.resetForm({
                values: {
                    name: '',
                },
            });
        } catch (excep) {
            console.log(excep);
        }
        // console.log(values, process.env.REACT_APP_API_URL);
    };
    const handleDelete = async (id: string) => {
        const sdd = await deleteCategorie(id);
        const NewaCategorie = categories.filter((categorie) => categorie._id !== id);
        setCategories(NewaCategorie);
        console.log(categories);
        console.log(id);
        console.log(sdd);
        setShowModal(false);
    };

    return (
        <div className="">
            <Button
                className="m-4"
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}
            >
                Add Categorie
            </Button>
            <Collapse in={open}>
                <div id="example-collapse-text">
                    <Formik
                        validationSchema={schema}
                        onSubmit={submitForm}
                        initialValues={{
                            name: '',
                        }}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Row style={{ width: '90%' }} className="vh-75 d-flex justify-content-center pt-3">
                                    <Col md={8} lg={6} xs={12}>
                                        <div className=" border border-2 border-primary" style={{ width: '90%' }}></div>
                                        <Card
                                            className=" shadow px-4 text-white bg-transparent "
                                            style={{ paddingBottom: '70px', width: '90%' }}
                                        >
                                            <Card.Body>
                                                <div className="mb-3 mt-md-4">
                                                    <h2 className="fw-bold mb-2 text-center text-uppercase text-dark">
                                                        Add Categorie
                                                    </h2>

                                                    <div className="mb-3">
                                                        <Form.Group className="mb-3" controlId="validationFormik01">
                                                            <Form.Label>Username</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="name"
                                                                placeholder="Enter Your Cat"
                                                                value={values.name}
                                                                onChange={handleChange}
                                                                isValid={touched.name && !errors.name}
                                                                isInvalid={!!errors.name}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.name}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <div className="d-grid pt-3">
                                                            <Button type="submit">Add categorie</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Collapse>
            <h2 className="m-5">All Quotes</h2>
            <Table style={{ width: '65%' }} className="m-4 text-black" striped bordered hover variant="white">
                <thead>
                    <tr>
                        <th className="text-center">Content</th>
                        <th className="text-center " colSpan={2}>
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((categorie, index) => (
                        <tr key={index}>
                            <td className="text-center w-25 ">{categorie.name}</td>
                            <td style={{ width: '14%' }}>
                                <button
                                    className="btn btn-warning w-100"
                                    onClick={() => {
                                        openUpdateModal(categorie);
                                    }}
                                >
                                    Update
                                </button>
                            </td>
                            <td style={{ width: '14%' }}>
                                <button
                                    className="btn btn-danger w-100"
                                    onClick={() => {
                                        openDeleteModal(categorie);
                                    }}
                                >
                                    delete
                                </button>
                                {/* <CustomModal
                                    show={showModal}
                                    handleClose={() => setShowModal(false)}
                                    handleAction={() => handleDelete(categorie._id)}
                                    title="Confirmation"
                                >
                                    Are you sure you want to delete this categorie ?{categorie._id}
                                </CustomModal> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <CustomModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleAction={() => handleDelete(currentCategory?._id!)}
                title="Confirmation"
                btnText="Delete"
                variant="danger"
            >
                Are you sure you want to delete this categorie
            </CustomModal>
            <CustomModal
                show={showUpdateModal}
                handleClose={() => setShowUpdateModal(false)}
                // handleAction={() => handlupdate(currentCategory?._id!, 'sd')}
                title="Update"
            >
                <UpdateForm
                    setShowUpdateModal={setShowUpdateModal}
                    categories={categories}
                    setCategories={setCategories}
                    currentCategory={currentCategory!}
                />
            </CustomModal>
        </div>
    );
};
export default TagsIndexPage;
