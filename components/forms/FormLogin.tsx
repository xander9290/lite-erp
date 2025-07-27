"use client";

import { userLogin } from "@/app/api/auth/login/login-actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

type TInputs = {
  login: string;
  password: string;
};

function FormLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TInputs>();

  const router = useRouter();

  const onSubmit: SubmitHandler<TInputs> = async (data) => {
    const res = await userLogin(data);
    if (!res.success) {
      toast.error(res.message, { position: "top-right" });
      return;
    }

    toast.success("Acesso correcto", { position: "bottom-right" });
    router.replace("/app");
  };

  console.log(isSubmitting);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs="12" sm="10" md="7" lg="5" xl="4" xxl="3">
          <Form className="card shadow mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title">Acceso</h4>
              <Link className="btn btn-primary btn-sm" href="/" title="Inicio">
                <i className="bi bi-house-fill"></i>
              </Link>
            </div>
            <fieldset className="card-body" disabled={isSubmitting}>
              <Form.Group controlId="UserLogin" className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-person-circle"></i>
                  </InputGroup.Text>
                  <Form.Control
                    {...register("login", {
                      required: "Este campo es requerido",
                    })}
                    type="text"
                    className="text-center"
                    autoComplete="off"
                    placeholder="Usuario"
                    autoFocus
                    isInvalid={!!errors.login}
                  />
                  <Form.Control.Feedback type="invalid" className="text-center">
                    {errors.login?.message}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="UserPassword" className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-lock-fill"></i>
                  </InputGroup.Text>
                  <Form.Control
                    {...register("password", {
                      required: "Este campo es requerido",
                      minLength: {
                        value: 4,
                        message: "La contraseña debe tener mínimo 4 caracteres",
                      },
                      maxLength: {
                        value: 8,
                        message: "La contraseña debe tener máximo 8 caracteres",
                      },
                    })}
                    type="password"
                    className="text-center"
                    autoComplete="off"
                    placeholder="Contraseña"
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid" className="text-center">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group className="d-grid">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-1" />
                      <span>Validando...</span>
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </Form.Group>
            </fieldset>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default FormLogin;
