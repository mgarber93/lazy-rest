import styled from 'styled-components';

export const StyledDiv = styled.div`
    display: grid;
    grid-template-columns: var(--name-gutter) 1fr;

    &.hovered {
        & .author.user {
            padding-top: 5rem;
        }

        & .content {
            background-color: var(--background-color-2)
        }
    }

    .author {
        transition: padding-top 0.5s ease-in-out;
        color: var(--accent-text);
        border-radius: var(--border-radius) var(--border-radius) 0 0;
        background-color: var(--background-color-1);

        &.user {
            color: var(--dark-grey);
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: var(--sage);

        button {
            background-color: unset;
            border: none;
        }

        svg {
            margin: 0 1rem;
            border-radius: var(--border-radius);

        }

        h1, h2 {
            font-size: large;
        }

        h3, h4, h5 {
            font-size: medium;
        }
    }

    border-radius: var(--border-radius);
    border-image-slice: 1;
    color: var(--text-color);
    border: none;
    padding: 1rem 0.2rem;
    font-size: var(--bs-body-font-size);

    p {
        margin: 0;
    }

    width: 100%;
    cursor: default;
`;